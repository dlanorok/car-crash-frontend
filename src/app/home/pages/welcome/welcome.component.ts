import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { CrashModel } from "../../../shared/models/crash.model";
import { HeaderService } from "../../../shared/services/header-service";
import { StorageItem } from "../../../shared/common/enumerators/storage";
import { Observable } from "rxjs";
import { createCrash } from '@app/app-state/crash/crash-action';
import { crashLoading } from "@app/app-state/crash/crash-selector";
import Konva from "konva";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  localStorageCrash?: string | null;
  loading$: Observable<boolean> = this.store.select(crashLoading);

  constructor(
    private readonly store: Store,
    private readonly headerService: HeaderService,
  ) {
  }

  createCrash() {
    this.store.dispatch(createCrash({crash: new CrashModel()}));
  }

  ngOnInit(): void {
    this.headerService.setHeaderData({
      name: '§§Car Crash assist'
    });
    this.localStorageCrash = localStorage.getItem(StorageItem.sessionId);
    const stage = new Konva.Stage({
      container: 'stage-container',
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const imageLayer = new Konva.Layer();
    stage.add(imageLayer);

    const imageObj = new Image();
    imageObj.src = 'https://maps.googleapis.com/maps/api/staticmap?center=50.10652785730121,14.4751838030305&zoom=18&size=1000x1000&key=AIzaSyASah8WJ1HIa-cJloHLP-EZf_YHO0szLvg&scale=2&maptype=satellite'; // Replace with the actual path to your image

    imageObj.onload = function () {
      const image = new Konva.Image({
        image: imageObj,
        width: imageObj.width,
        height: imageObj.height,
      });

      imageLayer.add(image);
      imageLayer.draw();
    };

    let scale = 1;
    let lastPos = stage.position();

    stage.on('wheel', (e) => {
      e.evt.preventDefault();

      const oldScale = scale;
      const pointer = stage.getPointerPosition();

      scale += e.evt.deltaY * -0.01;
      scale = Math.max(0.1, Math.min(10, scale)); // Adjust limits as needed

      if (!pointer) {
        return;
      }

      const newPos = {
        x: (pointer.x - lastPos.x) * (1 - scale / oldScale) + lastPos.x,
        y: (pointer.y - lastPos.y) * (1 - scale / oldScale) + lastPos.y,
      };

      stage.scale({ x: scale, y: scale });
      stage.position(newPos);
      stage.batchDraw();
    });

    let isDragging = false;
    stage.on('mousedown', () => {
      isDragging = true;
      lastPos = stage.position();
    });

    stage.on('mousemove', (e) => {
      if (!isDragging) return;
      const newPos = {
        x: lastPos.x + e.evt.movementX,
        y: lastPos.y + e.evt.movementY,
      };
      stage.position(newPos);
      stage.batchDraw();
    });

    stage.on('mouseup', () => {
      isDragging = false;
    });
  }
}
