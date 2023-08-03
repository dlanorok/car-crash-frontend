import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  defineComponents,
  DocumentReaderDetailType,
  DocumentReaderService,
  DocumentReaderWebComponent
} from '@regulaforensics/vp-frontend-document-components';
import { RegularForensicsApi } from "../../api/regula-forensics/regular-forensics-api";
import { ProcessRequest } from "@regulaforensics/document-reader-webclient/src/ext/process-request";
import { from, take, tap } from "rxjs";
import { GraphicFieldType, Scenario } from '@regulaforensics/document-reader-webclient';
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";


@Component({
  selector: 'app-ocr-component',
  templateUrl: './ocr-component.component.html',
  styleUrls: ['./ocr-component.component.scss']
})
export class OcrComponentComponent implements AfterViewInit, OnInit {

  @Input() showOCRComponent = false;
  @Input() title!: string;

  @Output() OCRResponse: EventEmitter<Response> = new EventEmitter<Response>();
  @Output() OCRToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('reader', { static: false }) reader?: ElementRef<DocumentReaderWebComponent>;

  ocrSvg = require('src/assets/icons/ocr.svg');

  constructor(private readonly regularForensicsApi: RegularForensicsApi) {
  }

  ngOnInit() {
    window.RegulaDocumentSDK = new DocumentReaderService();

    defineComponents().then(async () => {
      await window.RegulaDocumentSDK.prepare();
    });
  }

  ngAfterViewInit() {
    if (!this.reader) return;

    this.reader.nativeElement.settings = {
      startScreen: true,
      changeCameraButton: true,
      devLicense: 'AAEAAJfR0Kw2vm6AgfHgWU5evWJiH9WDEldyfLLSmGjaKKOX08mhg3/MVmH7F6eWI+p3b44Q3Ob6xcMv62E7dgIv1gLj34tSi0qK1mnqK2VDVBtk0Ts65VSNRU8q+kjHl1LCkY2apSV/Vm8WLi0b2B/xPF7DN/PRdmZDYfBhsH7w4mqxJoS5PjsCwfl2CZkji8TlBGYlTze90B09uuVGUGqMCoKf7G0eDpYpiJ1/vN23VOC+AkMh9PIMJdbmd69qGC+7IWpT+ISDxzR9fEApWgjut0E9Ma2COzu+6SQg99No5ecNUejQkDYohEu38G2zQh61Yvoh9idalFHlLo9/3zQAuxMkAQAAAAAAEImsKmwHcPTt7AmEzq9P42Xv66kukzs0Nzs6m6mpJxHA/z05tUMcn+IEBvw7qdBkJQQZX24gZ3gsvTwBoMiO+XqxHf6gObdU62HwOypj7zFbRmQEGdft2xTr23QcIOHT4cePK07mWGSU81Om8XqhZcfCiSj51J+GEW99EwdIN99vmwcoXu7K1B9rChGjX9twVH8jzqn7ZCgcJtY4mzWmyU+MnZ632AAsy2frqdY77enR42L3xkunr7WRHQR4qfXtDN2CaLOypbenuUkg0wsrlbjciOMm1hiw6sCl0aHsOiFNAOTfu11dJbKM7Dh9d98et9VyrqrHD0OdV3ChEY7HPwbIegHYwpnY60wGglhbEj8GdZKvTmkIvOp/fZG0RQ0Lmg=='
    };
  }

  documentReaderHandler(data: CustomEvent<DocumentReaderDetailType>) {
    if (data.detail.action === 'CLOSE') {
      this.OCRToggle.next(false);
      return;
    }

    console.log(data);

    if (data.detail.action === 'PROCESS_FINISHED') {
      const status = data.detail.data?.status;
      const isFinishStatus = status === 1;

      if (!isFinishStatus || !data.detail.data?.response) return;
      const componentResponse = data.detail.data.response;
      if (componentResponse.images) {
        const imageField = componentResponse.images.getField(GraphicFieldType.DOCUMENT_FRONT);
        if (!imageField) {
          return;
        }

        const documentFront = imageField.valueList[1].value;

        const request: ProcessRequest = {
          images: [documentFront],
          processParam: {
            scenario: Scenario.FULL_PROCESS
          },
          ContainerList: componentResponse.rawResponse.ContainerList
        };

        from(this.regularForensicsApi.process(request))
          .pipe(
            tap((response: Response) => {
              console.log(response);
              this.OCRResponse.next(response);
            }),
            take(1)
          ).subscribe();
      }
    }
  }
}
