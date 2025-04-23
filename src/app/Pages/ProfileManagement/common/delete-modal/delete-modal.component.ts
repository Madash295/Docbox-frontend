import { Component , Input, Output, EventEmitter } from '@angular/core';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { UtilsService } from '../../../../utils.service';
import { CommonModule  } from '@angular/common';
@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [IconModule , CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {
  @Input() isOpenDelete: boolean = false;
  @Input() title: string = '';
  @Input() serviceName: string = '';
  @Output() isOpenDeleteChange = new EventEmitter<boolean>();
  @Input() dataId: any = 0;
  @Output() deleteConfirmed = new EventEmitter<number>();

  close()
  {
    this.isOpenDelete = false;
    this.isOpenDeleteChange.emit(this.isOpenDelete);
  }
  constructor(private utilsService: UtilsService) { }
  handleDelete() {
    this.deleteConfirmed.emit(this.dataId);
    this.close();
    
  }
}
