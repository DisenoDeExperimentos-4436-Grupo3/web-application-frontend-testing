import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true
})
export class ModalComponent {
  @Input() isOpen: boolean = false; // Input to control modal visibility
  @Input() userStory: { startDate: string; endDate: string; effort: number; title: string; description: string } = {
    startDate: '',
    endDate: '',
    effort: 0,
    title: '',
    description: ''
  };

  @Output() saveStory = new EventEmitter<{ startDate: string; endDate: string; effort: number; title: string; description: string }>(); // Event emitter for saving

  closeModal() {
    this.isOpen = false; // Logic to close the modal
  }

  save() {
    this.saveStory.emit(this.userStory); // Emit the user story when saving
  }

  onStartDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.userStory.startDate = input.value;
  }

  onEndDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.userStory.endDate = input.value;
  }

  onEffortChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.userStory.effort = Number(input.value);
  }

  onTitleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.userStory.title = input.value;
  }

  onDescriptionChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.userStory.description = input.value;
  }
}
