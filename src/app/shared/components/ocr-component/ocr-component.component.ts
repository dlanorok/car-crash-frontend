import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {
  defineComponents,
  DocumentReaderDetailType,
  DocumentReaderService,
  DocumentReaderWebComponent
} from '@regulaforensics/vp-frontend-document-components';
import { RegularForensicsApi } from "../../api/regula-forensics/regular-forensics-api";
import { ProcessRequest } from "@regulaforensics/document-reader-webclient/src/ext/process-request";
import { from, tap } from "rxjs";
import { GraphicFieldType, Scenario } from '@regulaforensics/document-reader-webclient';
import { Response } from "@regulaforensics/document-reader-webclient/src/ext/process-response";


@Component({
  selector: 'app-ocr-component',
  templateUrl: './ocr-component.component.html',
  styleUrls: ['./ocr-component.component.scss']
})
export class OcrComponentComponent implements AfterViewInit, OnInit {

  @Output() OCRResponse: EventEmitter<Response> = new EventEmitter<Response>();
  @Output() closeOCR: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('reader', { static: false }) reader?: ElementRef<DocumentReaderWebComponent>;

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
      devLicense: 'AAEAABBmWVwKhDA1oG8sQn2wSCaOqJVF7xEgi9lY1atcFHJNn5KObyqKbhY8lyW+tHzhZcjEcgJmOo5Aa73ot5KohpmaMRzKL0EEJ/z5fsBJeK5CaGD6JVmX8JP4eZPFBam8fyKVxVksNOJh3O1gthxGb5eNhoNGF2MT5gzCApw67bSne3X2KyVJeEEt/wvmmfhNUa/Tm2mHr70huUDkbMOhG3Y61dldcfRnzZGMS8YSiyj/VANxRaRJjvByQRZq3VJzrXtVl+n1hLqzWFiUrfiS7a/7jVh3FIjWgX7nAg/oApGEcdOkrB8h+5Txyto9JXyQjdXjA7K0Fn9ntUlEIHSOW+nkAAAAAAAAEJmLvp0m+LHs2EPWs3WUb6acaHpVHe++xIjVSmtpDntnXBKREb3mySvflEhfW5WWm2Qcf2dCYigXW6ImqKt8xUDYmRJo3J2fj525xnX+19wZihEieir97ISnCPAFG6jYGwmu6P1JJ8QlXqh1Q6+GPjt4pJgbRmslCk40ka27D0+92qFZVosS7mVTXfP9+5O/pm0XYQQ4JBfZkKMOIkcORzacbDd2Y9COi3BuVhPxZxtu8P9qJjsye3tjmSAwryr6XTVdaz6nksl1aI1Re/HoEC1Y4s9Jn9tkiAKc9OgTdz2v',
    };
  }

  documentReaderHandler(data: CustomEvent<DocumentReaderDetailType>) {
    if (data.detail.action === 'CLOSE') {
      this.closeOCR.next(true);
      return;
    }

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
            })
          ).subscribe();
      }
    }
  }
}
