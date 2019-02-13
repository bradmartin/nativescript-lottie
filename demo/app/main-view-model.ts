import { Observable } from 'tns-core-modules/data/observable';
import { LottieView, SrcMode } from 'nativescript-lottie';
import { Color } from 'tns-core-modules/color/color';
import { HAPPY_BIRTHDAY_SRC } from './src-mode-demo';

const ANDROID_WAVE_KEYPATHS = [
  ['Shirt', 'Group 5', 'Fill 1'],
  ['LeftArmWave', 'LeftArm', 'Group 6', 'Fill 1'],
  ['RightArm', 'Group 6', 'Fill 1']
];

export class DemoViewModel extends Observable {
  public animationIndex: number = 0;
  public animations: string[] = [
    'Mobilo/B.json',
    'Mobilo/A.json',
    'Mobilo/D.json',
    'Mobilo/N.json',
    'Mobilo/R.json',
    'Mobilo/S.json'
  ];
  public thirdLottieProgressTo: string = 'Try it!';

  /**
   * For demoing cycling through the sample animations.
   */
  private _lottieViewOne: LottieView;

  /**
   * For demoing changing colors and opacity dynamically at runtime.
   */
  private _lottieViewTwo: LottieView;

  /**
   * For demoing partially animating a composition.
   */
  private _lottieViewThree: LottieView;

  /**
   * For demoing the completion block (i.e for async work).
   */
  private _lottieViewFour: LottieView;

  /**
   * For demoing SrcMode (loading compositions using in-memory json).
   */
  private _lottieViewFive: LottieView;

  public firstLottieLoaded(event) {
    this._lottieViewOne = event.object as LottieView;
    this._lottieViewOne.autoPlay = true;
    this._lottieViewOne.loop = true;
    this._lottieViewOne.src = this.animations[this.animationIndex];
    this._lottieViewOne.completionBlock = (animationFinished: boolean) => {
      console.log(`completionBlock animationFinished: ${animationFinished}`);
    };
  }

  public secondLottieLoaded(event) {
    this._lottieViewTwo = event.object as LottieView;
    this._lottieViewTwo.autoPlay = true;
    this._lottieViewTwo.loop = true;
    this._lottieViewTwo.src = 'AndroidWave.json';
  }

  public thirdLottieLoaded(event) {
    this._lottieViewThree = event.object as LottieView;
    this._lottieViewThree.autoPlay = false;
    this._lottieViewThree.loop = false;
    this._lottieViewThree.src = 'Mobilo/N.json';
  }

  public fourthLottieLoaded(event) {
    this._lottieViewFour = event.object as LottieView;
    this._lottieViewFour.autoPlay = false;
    this._lottieViewFour.src = 'doughnut.json';

    this.setFourthLottieToLoadingState();
  }

  public fifthLottieLoaded(event) {
    this._lottieViewFive = event.object as LottieView;
    this._lottieViewFive.autoPlay = true;
    this._lottieViewFive.loop = true;
    this._lottieViewFive.srcMode = SrcMode.Json;
    this._lottieViewFive.src = HAPPY_BIRTHDAY_SRC;
  }

  public next() {
    this.animationIndex++;
    if (this.animationIndex >= this.animations.length) {
      this.animationIndex = 0;
    }
    this._lottieViewOne.src = this.animations[this.animationIndex];
  }

  public toggleAnimation() {
    if (this._lottieViewOne.isAnimating()) {
      this._lottieViewOne.cancelAnimation();
    } else {
      this._lottieViewOne.playAnimation();
    }
  }

  public toggleLoop() {
    this._lottieViewOne.loop = !this._lottieViewOne.loop;
  }

  public setTheme = value => () => {
    const color = new Color(value);
    ANDROID_WAVE_KEYPATHS.forEach(keyPath => {
      this._lottieViewTwo.setColorValueDelegateForKeyPath(color, [...keyPath]);
    });
  };

  public setSecondLottieRandomOpacity() {
    const opacity = getRandomWithPrecision(2);
    ANDROID_WAVE_KEYPATHS.forEach(keyPath => {
      this._lottieViewTwo.setOpacityValueDelegateForKeyPath(opacity, [
        ...keyPath
      ]);
    });
  }

  public setThirdLottieRandomProgress() {
    const toProgress = getRandomWithPrecision(2);
    this.set('thirdLottieProgressTo', `Animated to ${toProgress}`);
    this._lottieViewThree.playAnimationFromProgressToProgress(0, toProgress);
  }

  public setFourthLottieToLoadingState() {
    this._lottieViewFour.loop = true;
    this._lottieViewFour.playAnimationFromProgressToProgress(0, 0.5);
  }

  public setFourthLottieToLoadedState() {
    this._lottieViewFour.completionBlock = (animationFinished: boolean) => {
      console.log(
        `lottieViewFour completionBlock animationFinished: ${animationFinished}`
      );

      this._lottieViewFour.playAnimationFromProgressToProgress(0.5, 0.85);
      this._lottieViewFour.completionBlock = null;
    };

    // Trigger the completion block by disabling looping and allowing the final loop to lapse.
    this._lottieViewFour.loop = false;
  }
}

function getRandomWithPrecision(precision?: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(Math.random() * multiplier) / multiplier;
}
