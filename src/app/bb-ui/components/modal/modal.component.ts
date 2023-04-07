import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  get isModalOpen(): boolean {
    return this.modalService.getIsModalOpen();
  }

  @Input() modalTitle = '';
  @Output() submitted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(private modalService: ModalService) { }

  onSubmit() {
    this.submitted.emit();
    this.modalService.setIsModalOpen(false);
  }

  onCancel() {
    this.cancelled.emit();
    this.modalService.setIsModalOpen(false);
  }
}
