import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export const SAMPLE_EDI_271 = `ISA*00*          *00*          *ZZ*SUBMITTER1     *ZZ*PAYER001       *260821*1200*^*00501*000000001*0*T*:~
GS*HB*SUBMITTER1*PAYER001*20260821*1200*1*X*005010X279A1~
ST*271*0001*005010X279A1~
BHT*0022*11*REQ12345*20260821*1200~
HL*1**20*1~
NM1*PR*2*AETNA*****PI*60054~
HL*2*1*21*1~
NM1*1P*2*ORTHOPEDIC SPECIALISTS*****XX*1234567890~
HL*3*2*22*0~
NM1*IL*1*DOE*JOHN****MI*W123456789~
DMG*D8*19850412*M~
DTP*291*D8*20260821~
EB*1*IND*30*PR**10*0.20*Y*Y~
EB*CB*IND*30*PR*****Y*Y~
MSG*PRIOR AUTHORIZATION REQUIRED FOR ADVANCED IMAGING AND MRI PROCEDURES~
EB*C*IND*30*PR*25*500***Y~
SE*17*0001~
GE*1*1~
IEA*1*000000001~`;

@Component({
  selector: 'app-file-drop-zone',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div
      class="dropzone-container"
      [class.dragover]="isDragOver"
      [class.has-file]="!!fileContent"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <input
        #fileInput
        type="file"
        class="hidden-file-input"
        [accept]="acceptExtensions"
        (change)="onFileSelected($event)"
      />

      @if (!fileContent) {
        <div class="dropzone-prompt">
          <mat-icon class="upload-icon">cloud_upload</mat-icon>
          <h4 class="prompt-title">Drag & drop your EDI 271 or JSON file here</h4>
          <p class="prompt-sub">Supports .271, .txt, .edi, and .json format</p>
          <div class="action-buttons" (click)="$event.stopPropagation()">
            <button mat-stroked-button color="primary" type="button" (click)="fileInput.click()">
              <mat-icon>attach_file</mat-icon> Browse Files
            </button>
            <button mat-flat-button color="accent" type="button" (click)="loadSample()">
              <mat-icon>science</mat-icon> Load Sample EDI 271
            </button>
          </div>
        </div>
      } @else {
        <div class="file-loaded-view" (click)="$event.stopPropagation()">
          <div class="file-info-header">
            <div class="name-badge">
              <mat-icon color="primary">description</mat-icon>
              <div>
                <strong>{{ fileName }}</strong>
                <span class="file-meta">({{ fileSize }} | {{ lineCount }} lines)</span>
              </div>
            </div>
            <div class="file-controls">
              <button mat-icon-button color="warn" type="button" (click)="clearFile()" title="Remove file">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
          <pre class="file-preview-content">{{ previewText }}</pre>
        </div>
      }
    </div>
  `,
  styles: [`
    .dropzone-container {
      border: 2px dashed var(--rcm-border-strong, #cbd5e1);
      border-radius: 12px;
      padding: 1.5rem;
      background: var(--rcm-surface, #ffffff);
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover, &.dragover {
        border-color: var(--rcm-primary-color, #303f9f);
        background: #f8faff;
      }
      &.has-file {
        cursor: default;
        border-style: solid;
        border-color: #818cf8;
      }
    }
    .hidden-file-input {
      display: none;
    }
    .upload-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }
    .prompt-title {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: var(--rcm-text-primary, #0f172a);
    }
    .prompt-sub {
      font-size: 0.8125rem;
      color: var(--rcm-text-secondary, #64748b);
      margin: 0 0 1rem 0;
    }
    .action-buttons {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .file-loaded-view {
      width: 100%;
      text-align: left;
    }
    .file-info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .name-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .file-meta {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
    }
    .file-preview-content {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 0.75rem;
      font-family: monospace;
      font-size: 0.75rem;
      color: #334155;
      max-height: 120px;
      overflow-y: auto;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }
  `]
})
export class FileDropZoneComponent {
  @Input() acceptExtensions = '.271,.txt,.edi,.json';
  @Output() payloadChange = new EventEmitter<string>();

  isDragOver = false;
  fileName = '';
  fileSize = '';
  lineCount = 0;
  fileContent = '';
  previewText = '';

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files?.length) {
      this.readFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.readFile(input.files[0]);
    }
  }

  private readFile(file: File): void {
    this.fileName = file.name;
    this.fileSize = `${(file.size / 1024).toFixed(1)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.setPayload(text, file.name);
    };
    reader.readAsText(file);
  }

  loadSample(): void {
    this.fileName = 'sample_aetna_knee_mri.271';
    this.fileSize = '0.9 KB';
    this.setPayload(SAMPLE_EDI_271, this.fileName);
  }

  private setPayload(content: string, name: string): void {
    this.fileContent = content;
    this.fileName = name;
    this.lineCount = content.split('\n').length;
    this.previewText = content.substring(0, 300) + (content.length > 300 ? '...' : '');
    this.payloadChange.emit(this.fileContent);
  }

  clearFile(): void {
    this.fileContent = '';
    this.fileName = '';
    this.previewText = '';
    this.lineCount = 0;
    this.payloadChange.emit('');
  }
}
