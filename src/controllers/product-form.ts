import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  connect() {
    console.log('yauh');
  }

  react() {
    console.log('react');
  }
}
