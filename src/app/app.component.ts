import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'taking-a-screenshot';
  constructor(private deviceService: DeviceDetectorService) {}
  takeCoolScreenshot() {
    console.log('screenshoniando...');
    html2canvas(
      // @ts-ignore
      document.querySelector('#capture'),
      { useCORS: true }
    ).then((canvas) => {
      if (this.deviceService.isDesktop()) {
        this.downloadImage(canvas);
      } else {
        this.share(canvas);
      }
    });
  }

  takeNormalScreenshot() {
    html2canvas(
      // @ts-ignore
      document.querySelector('#capture'),
      { useCORS: true }
    ).then((canvas) => {
      this.share(canvas);
    });
  }

  downloadImage(canvas: HTMLCanvasElement) {
    console.log('Downloading image...');
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'irole.jpg';
        link.click();
      }
    }, 'image/jpg');
  }

  share(canvas: HTMLCanvasElement) {
    console.log('estoy tratando de compartir via phone');
    if (navigator.share) {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'my-image.png', {
            type: 'image/png',
            lastModified: Date.now(),
          });
          const share: ShareData = {
            title: 'The Road Not Taken',
            text: 'This poem was written by Robert Frost in 1916. It is a classic example of a short poem that is both beautiful and thought-provoking.',
            files: [file],
          };
          navigator.share(share).then(
            () => {
              console.log('Sharing was successful');
            },
            (error) => {
              console.log('Sharing failed', error);
            }
          );
        }
      }, 'image/png');
    } else {
      console.log('Browser does not support the Web Share API');
    }
  }
}
