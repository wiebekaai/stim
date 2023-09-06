import { Application } from '@hotwired/stimulus';

window.Stimulus = Application.start();

window.Stimulus.logDebugActivity = function (id, fn, detail) {
  if (fn === 'start') {
    console.log('[Stimulus] Started');
  }

  if (fn === 'initialize') {
    console.log('[Stimulus] ✨ Registered', id);
  }
  if (fn === 'connect') {
    // @ts-ignore
    console.log('[Stimulus] 🔗 Connected', id, detail!.element);
  }

  if (fn === 'disconnect') {
    // @ts-ignore
    console.log('[Stimulus] ⏏ Disconnected', id, detail!.element);
  }

  if (detail?.event?.type && typeof document.body['on' + detail?.event?.type.toString()] === 'undefined') {
    console.log('[Stimulus] 📡 Dispatched', detail.event.type, detail?.event.detail);
  }
};
