import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent {
  @Input() imageUrl: string | undefined;
  @Output() closePreview: EventEmitter<void> = new EventEmitter<void>();

  closeImagePreview() {
    this.closePreview.emit();
  }
}
