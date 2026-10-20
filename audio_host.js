// Browser audio activation and read-only output diagnostics. Gameplay/audio sources stay in Godot.
(() => {
  const Native = window.AudioContext || window.webkitAudioContext;
  if (!Native) return;
  const contexts = [], starts = [];
  let errors = [], resumes = 0;
  class GameAudioContext extends Native {
    constructor(options) {
      super(options);
      contexts.push(this);
      this.gameMeter = this.createAnalyser();
      this.gameMeter.fftSize = 2048;
      this.gameMeter.connect(this.destination);
      this.gameMeterData = new Float32Array(2048);
      const create = this.createBufferSource.bind(this);
      this.createBufferSource = () => {
        const source = create(), start = source.start.bind(source);
        source.start = (...args) => {
          starts.push({duration:source.buffer?.duration || 0,time:this.currentTime,offset:args[1] || 0});
          if (starts.length > 32) starts.shift();
          return start(...args);
        };
        return source;
      };
    }
  }
  const connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function(destination, ...args) {
    const ctx = this.context;
    if (ctx.gameMeter && destination === ctx.destination && this !== ctx.gameMeter) destination = ctx.gameMeter;
    return connect.call(this, destination, ...args);
  };
  window.AudioContext = GameAudioContext;
  if (window.webkitAudioContext) window.webkitAudioContext = GameAudioContext;
  const unlock = () => {
    for (const ctx of contexts) if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
      resumes++;
      ctx.resume().catch(e => errors.push(String(e)));
    }
  };
  for (const event of ['pointerdown','touchend','keydown']) document.addEventListener(event, unlock, {capture:true, passive:true});
  window.catAudio = {status: () => ({resumes,errors,starts,contexts:contexts.map(ctx => {
    ctx.gameMeter.getFloatTimeDomainData(ctx.gameMeterData);
    let sum=0,peak=0;
    for(const n of ctx.gameMeterData){sum+=n*n;peak=Math.max(peak,Math.abs(n));}
    return {state:ctx.state,time:ctx.currentTime,sampleRate:ctx.sampleRate,rms:Math.sqrt(sum/ctx.gameMeterData.length),peak};
  })})};
})();
