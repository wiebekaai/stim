import type { Application } from '@hotwired/stimulus';

declare global {
  interface Window {
    Stimulus: Application;
  }
}
