import Phaser, { Scene } from 'phaser';

let hasTouch;
window.addEventListener('touchstart', function setHasTouch() {
  hasTouch = true;
  // Remove event listener once fired, otherwise it'll kill scrolling
  // performance
  window.removeEventListener('touchstart', setHasTouch);
}, false);

class StartScreen extends Scene {
  constructor() {
    super('startscreen');
  }

  preload() {
    this.load.image('screen', '/interactive/2019/08/phaser-game/assets/title-screen.png');
    this.load.image('play', '/interactive/2019/08/phaser-game/assets/play.png');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const screen = this.add.image(0, 0, 'screen');
    screen.setOrigin(0, 0);

    this.button = this.add.image(width / 2, height * 0.6, 'play');
    this.button.setDepth(6).setInteractive();
    this.button.on('pointerup', () => {
      if (hasTouch === true) {
        this.scene.start('instructionstouch');
      } else {
        this.scene.start('instructions');
      }
    });
  }
}

export default StartScreen;
