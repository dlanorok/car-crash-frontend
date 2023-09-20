import {
  ComponentRef,
  createNgModule,
  Directive,
  HostListener,
  inject,
  Injector,
  ViewContainerRef
} from "@angular/core";
import { ImagePreviewComponent } from "@app/shared/components/ui/image-preview/image-preview.component";
import { ImagePreviewModule } from "@app/shared/components/ui/image-preview/image-preview.module";
import { writeComponentRefChanges } from "../../write-component-ref-changes";

@Directive({
  selector: '[appImagePreview]',
})
export class ImagePreviewDirective {
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly injector: Injector = inject(Injector);

  @HostListener('click', ['$event.target'])
  onClick(imageElement: HTMLImageElement) {
    const imageUrl = imageElement.getAttribute('src');
    if (imageUrl) {
      this.openImagePreview(imageUrl);
    }
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
}
