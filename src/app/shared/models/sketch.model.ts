import { BaseModel } from "@app/shared/models/base.model";

export class SketchModel extends BaseModel {
  crash!: number;
  polygons!: string;
  sketch_cars!: SketchCarModel[];
  creator!: string;

  constructor(data?: any) {
    super(data);
  }
}

export class LatLngModel {
  lat!: number;
  lng!: number;

  constructor(data?: any) {
    Object.assign(this, data);
  }

  getGoogleLatLng(): google.maps.LatLng {
    return new google.maps.LatLng({lat: this.lat, lng: this.lng});
  }
}

export class SketchCarModel {
  rotation!: number;
  id!: number;
  car_id!: number;
  sketch!: number;
  position_south!: number;
  position_west!: number;
  position_north!: number;
  position_east!: number;

  constructor(data?: any) {
    Object.assign(this, data);
  }
}

export interface PolygonsData {
  sketch_id: number;
  polygons: google.maps.LatLng[][];
}
