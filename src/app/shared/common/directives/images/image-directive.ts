import {
  ChangeDetectorRef, ComponentRef, createNgModule,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject, Injector,
  Input,
  OnChanges, ViewContainerRef
} from "@angular/core";
import { FilesApiService } from "@app/shared/api/files/files-api.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { finalize, of, take } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ImagePreviewComponent } from "@app/shared/components/ui/image-preview/image-preview.component";
import { ImagePreviewModule } from "@app/shared/components/ui/image-preview/image-preview.module";
import { writeComponentRefChanges } from "../../write-component-ref-changes";

@Directive({
  selector: '[appImage]',
})
export class ImageDirective implements OnChanges {
  private readonly filesApiService: FilesApiService = inject(FilesApiService);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly el: ElementRef = inject(ElementRef);
  private readonly changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly injector: Injector = inject(Injector);

  @Input() imageId!: number;
  @HostBinding('src') src: SafeResourceUrl = '';
  @HostBinding('alt') alt: SafeResourceUrl = '';
  @HostBinding('attr.data-size') dataSize = '';
  @HostBinding('attr.data-name') dataName = '';

  @HostListener('click', ['$event.target'])
  onClick(imageElement: HTMLImageElement) {
    const imageUrl = imageElement.getAttribute('src');
    if (imageUrl) {
      this.openImagePreview(imageUrl);
    }
  }

  private readonly defaultSrc: string;
  private readonly defaultAlt: string;

  constructor() {
    this.defaultSrc = this.el.nativeElement.getAttribute('src');
    this.defaultAlt = this.el.nativeElement.getAttribute('alt');
  }

  ngOnChanges(): void {
    if (this.imageId) {
      this.loadImage();
    } else {
      this.setDefaults();
    }
  }

  private setDefaults() {
    this.src = this.defaultSrc || '';
    this.alt = this.defaultAlt || '';
  }

  private openImagePreview(imageUrl: string) {
    const componentRef: ComponentRef<ImagePreviewComponent> = this.viewContainerRef.createComponent(ImagePreviewComponent, {
      ngModuleRef: createNgModule(
        ImagePreviewModule,
        this.injector,
      )
    });
    this.writeComponentRefChanges(componentRef, {imageUrl: imageUrl});
    componentRef.instance.closePreview.subscribe(() => {
      componentRef.destroy();
    });
    componentRef.changeDetectorRef.detectChanges();
  }

  private writeComponentRefChanges(controlComponentRef: ComponentRef<ImagePreviewComponent>, changes: Partial<ImagePreviewComponent>): void {
    writeComponentRefChanges(controlComponentRef, changes);
    controlComponentRef.changeDetectorRef.detectChanges();
  }

  private loadImage() {
    this.filesApiService.getFileData(this.imageId).pipe(
      take(1),
      map(image => [this.sanitizer.bypassSecurityTrustResourceUrl(image.file), image.file_name, image.file_size]),
      catchError(() => of([this.defaultSrc || './assets/svg/404.svg', this.defaultAlt || 'no image', "0"])),
      finalize(() => this.changeDetectorRef.detectChanges()),
    ).subscribe(([src, name, fileSize]) => {

      if (src) {
        this.src = src;
      }

      if (fileSize) {
        this.dataSize = fileSize.toString();
      }

      if (name) {
        this.alt = name;
        this.dataName = name.toString();
      }
    });
  }
}
