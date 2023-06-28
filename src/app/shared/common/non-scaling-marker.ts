import { document } from "ngx-bootstrap/utils";
import { isTouchDevice } from "@app/shared/common/is-touch-device";
import { SketchCarModel } from "@app/shared/models/sketch.model";

export class CarOverlay extends google.maps.OverlayView {
  bounds_: google.maps.LatLngBounds;
  rotation = 0.0;
  carId: number;
  shouldSave = false;
  private image_: string;
  private rotate_: string;
  private div_: HTMLElement | null;
  private imageElement?: HTMLElement | null;
  private isDragging = false;
  private isRotating = false;
  private startX!: number;
  private startY!: number;
  private boxCenter = { x: 0, y: 0, angle: 180};
  private touchRotation = {current: 0, finished: 0};
  private canEdit: boolean;
  private pauseListeners = false;

  constructor(
    bounds: google.maps.LatLngBounds,
    carId: number,
    rotation = 0,
    index = 1,
    canEdit= false) {
    super();

    this.carId = carId;
    this.rotation = rotation;
    this.canEdit = canEdit;

    // Initialize all properties.
    this.bounds_ = bounds;
    this.image_ = `../../../assets/icons/google-car-${index}.svg`;
    this.rotate_ = '../../../assets/icons/rotate.svg';

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;
  }

  pauseListenersToggle(flag: boolean) {
    this.pauseListeners = flag;
  }

  getSketchCarModel(sketchId?: number): SketchCarModel {
    const sketchCar = new SketchCarModel();
    sketchCar.car_id = this.carId;
    sketchCar.position_south = this.bounds_.getSouthWest().lat();
    sketchCar.position_west = this.bounds_.getSouthWest().lng();
    sketchCar.position_north = this.bounds_.getNorthEast().lat();
    sketchCar.position_east = this.bounds_.getNorthEast().lng();
    sketchCar.rotation = this.rotation;

    if (sketchId) {
      sketchCar.sketch = sketchId;
    }
    return sketchCar;
  }

  /**
   * onAdd is called when the map's panes are ready and the overlay has been
   * added to the map.
   */
  onAdd() {
    this.div_ = document.createElement("div");
    if (!this.div_) {
      return;
    }
    this.div_.style.borderStyle = "none";
    this.div_.style.borderWidth = "0px";
    this.div_.style.position = "absolute";


    const divWrapper = document.createElement("div");
    divWrapper.style.position = "relative";
    divWrapper.style.width = "30%";
    divWrapper.style.height = "30%";
    this.div_?.appendChild(divWrapper);

    // Create the img element and attach it to the div.
    const img = document.createElement("img");

    img.src = this.image_;
    img.style.position = "absolute";
    img.style.transform = "rotate(180deg)";
    img.style.touchAction = "none";
    img.style.width = "80%";
    img.style.height = "80%";
    this.div_.appendChild(img);

    const rotateImg = document.createElement("img");

    rotateImg.src = this.rotate_;
    rotateImg.style.position = "absolute";
    rotateImg.style.transform = "rotate(150deg)";
    rotateImg.style.width = "100%";
    rotateImg.style.height = "100%";

    divWrapper.appendChild(rotateImg);

    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes()!;
    panes.overlayMouseTarget.appendChild(this.div_);
    this.div_.style.transform = `rotate(${this.rotation}deg)`;


    // MOBILE
    if (!this.canEdit) {
      return;
    }

    img.addEventListener('touchstart', this.onDragStart.bind(this));
    img.addEventListener('touchmove', this.onDrag.bind(this));

    img.addEventListener('mousedown', this.onDragStart.bind(this));
    img.addEventListener('mousemove', this.onDrag.bind(this));

    rotateImg.addEventListener('mousedown', this.onRotateStart.bind(this));
    rotateImg.addEventListener('touchstart', this.onRotateStart.bind(this));
    rotateImg.addEventListener('mousemove', this.onRotate.bind(this));
    rotateImg.addEventListener('touchmove', this.onRotate.bind(this));

    if (isTouchDevice()) {
      document.getElementById("map").addEventListener('touchend', this.onDragEnd.bind(this));
    } else {
      this.getMap()?.addListener('mouseup', this.onDragEnd.bind(this));
    }
  }

  rotate(rotationAngle: number) {
    if (this.div_ && !this.pauseListeners) {
      this.rotation = rotationAngle;
      this.div_.style.transform = `rotate(${rotationAngle}deg)`;
      this.shouldSave = true;
    }
  }

  onRotateStart(event: MouseEvent | TouchEvent) {
    if (document.getElementById("map")?.classList.contains("drawing")) {
      return;
    }
    this.getMap()?.set('draggable', false);
    this.isRotating = true;

    const rect = this.div_?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    this.boxCenter.x = rect.left + rect.width / 2;
    this.boxCenter.y = rect.top + rect.height / 2;
  }

  onRotate(e: MouseEvent | TouchEvent) {
    if (!this.isRotating) {
      return;
    }

    const center = {
      x: this.boxCenter.x || 0,
      y: this.boxCenter.y || 0,
    };

    const angle = this.getAngle(center, e);

    this.rotate(angle);
  }

  getAngle(center: {x: number, y:number}, event: MouseEvent | TouchEvent) {
    if ((event as MouseEvent).clientX) {
      event = event as MouseEvent;
      return Math.atan2(center.y - event.clientY, center.x - event.clientX) * 180 / Math.PI;
    } else {
      event = event as TouchEvent;
      if (!event.touches) {
        return 0;
      }
      return Math.atan2(center.y - event.touches[0].clientY, center.x - event.touches[0].clientX) * 180 / Math.PI;
    }
  }

  onDragStart(e: MouseEvent | TouchEvent) {
    if (document.getElementById("map")?.classList.contains("drawing")) {
      return;
    }

    this.getMap()?.set('draggable', false);
    this.isDragging = true;

    if ((e as MouseEvent).clientX) {
      e = e as MouseEvent;
      this.startX = e.clientX;
      this.startY = e.clientY;
    } else {
      e = e as TouchEvent;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    }
  }

  onDrag(e: MouseEvent | TouchEvent) {

    // Double finger rotate
    if (!(e as MouseEvent).clientX && this.div_) {
      e = e as TouchEvent;
      if (e.touches && e.touches.length > 1) {
        const rotation = Math.atan2(e.touches[0].pageY - e.touches[1].pageY,
          e.touches[0].pageX - e.touches[1].pageX) * 180 / Math.PI;
        this.touchRotation.current = rotation + this.touchRotation.finished;

        this.div_.style.transform = `rotate(${rotation + this.touchRotation.finished}deg)`;
      }
    }


    if (this.isDragging) {
      let dx, dy;
      if ((e as MouseEvent).clientX) {
        e = e as MouseEvent;
        dx = e.clientX - this.startX;
        dy = e.clientY - this.startY;

        this.startX = e.clientX;
        this.startY = e.clientY;
      } else {
        e = e as TouchEvent;
        dx = e.touches[0].clientX - this.startX;
        dy = e.touches[0].clientY - this.startY;

        this.startX = e.touches[0].clientX ;
        this.startY = e.touches[0].clientY;
      }


      const overlayProjection = this.getProjection();
      const div = this.div_;
      if (!div) {
        return;
      }

      div.style.left = div.offsetLeft + dx + "px";
      div.style.top = div.offsetTop + dy + "px";

      const newSw = overlayProjection.fromDivPixelToLatLng(new google.maps.Point(div.offsetLeft, div.offsetTop + div.offsetHeight));
      const newNe = overlayProjection.fromDivPixelToLatLng(new google.maps.Point(div.offsetLeft + div.offsetWidth, div.offsetTop));
      this.bounds_ = new google.maps.LatLngBounds(newSw, newNe);
      this.shouldSave = true;
    }
  }

  onDragEnd(event: MouseEvent | TouchEvent) {
    if ((event as TouchEvent).touches) {
      this.touchRotation.finished = this.touchRotation.current;
      event = event as TouchEvent;
      if (event.touches.length > 0) {
        return;
      }
    }
    this.getMap()?.set('draggable', true);
    this.isDragging = false;
    this.isRotating = false;
  }



  draw() {
    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    const overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    const sw = overlayProjection.fromLatLngToDivPixel(
      this.bounds_.getSouthWest()
    )!;
    const ne = overlayProjection.fromLatLngToDivPixel(
      this.bounds_.getNorthEast()
    )!;

    // Resize the image's div to fit the indicated dimensions.
    if (this.div_) {
      this.div_.style.left = sw.x + "px";
      this.div_.style.top = ne.y + "px";
      this.div_.style.width = ne.x - sw.x + "px";
      this.div_.style.height = sw.y - ne.y + "px";
    }
  }

  /**
   * The onRemove() method will be called automatically from the API if
   * we ever set the overlay's map property to 'null'.
   */
  onRemove() {
    if (this.div_) {
      (this.div_.parentNode as HTMLElement).removeChild(this.div_);
      this.div_ = null;
    }
  }
}
