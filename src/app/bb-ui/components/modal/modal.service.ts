import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isModalOpen = false;

  constructor() { }

  getIsModalOpen(): boolean {
    return this.isModalOpen;
  }

  setIsModalOpen(isModalOpen: boolean): void {
    this.isModalOpen = isModalOpen;
  }
}
