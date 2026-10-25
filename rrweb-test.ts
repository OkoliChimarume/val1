import { record } from '@rrweb/record';

let stopRecording: (() => void) | undefined;

const events: unknown[] = [];

export function startRecording() {
  if (stopRecording) return;

  events.length = 0;

  stopRecording = record({
    emit(event) {
      events.push(event);

      console.log('rrweb event:', event);
    },
    maskAllInputs: true,
    blockSelector: '[data-private]',
  });

  console.log('rrweb recording started');
}

export function stopAndGetRecording() {
  stopRecording?.();
  stopRecording = undefined;

  console.log('Recorded events:', events.length);

  return [...events];
}