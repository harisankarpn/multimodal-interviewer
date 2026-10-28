import { ChangeDetectionStrategy, Component, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

 @Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
   templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  secondsRemaining = signal<number>(15 * 60);
  timerInterval: any;

  // Mic mute & modal state
  isMicMuted = signal<boolean>(false); // Starts muted as requested in reference image
  isMicModalOpen = signal<boolean>(false); // Opens modal on load matching reference

  // Transcript & Notes modal state
  isTranscriptModalOpen = signal<boolean>(false);

  // Help & Documentation modal state
  isHelpModalOpen = signal<boolean>(false);
  isDiagnosticModalOpen = signal<boolean>(false);
  isTelemetryModalOpen = signal<boolean>(false);

   // Voice Switch Modal state & form
  isVoiceSwitchModalOpen = signal<boolean>(false);
  selectedVoiceReason = signal<string>('');
  otherReasonText = signal<string>('');

  rmsBars = signal<number[]>([35, 60, 40, 80, 50, 95, 30, 45, 70, 85, 40, 65, 50, 30, 75, 90, 45, 60, 35, 70, 55, 40]);
  aiWaveform = signal<number[]>([20, 45, 70, 40, 90, 60, 30, 85, 100, 75, 40, 65, 80, 50, 95, 30, 70, 85, 45, 60, 90, 40, 30, 65, 80, 50, 35]);
  candidateWaveform = signal<number[]>([15, 30, 55, 75, 45, 30, 60, 80, 40, 25, 50, 70, 90, 60, 35, 20, 45, 65, 85, 40, 30, 55, 70, 45, 25, 50, 35]);

  formattedTime = computed(() => {
    const totalSecs = this.secondsRemaining();
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  // Chat-first interaction state (false = Chat primary, true = Voice converted mode)
  isVoiceMode = signal<boolean>(false);
  chatMessages = signal<Array<{ sender: string; text: string; time: string; type: 'ai' | 'candidate' }>>([
    {
      sender: 'GEMINI ENTERPRISE AI',
      text: 'The symptoms show dead-end thread spikes in the router service. How would you start triage on thread pool exhaustion?',
      time: '10:38 PM',
      type: 'ai'
    },
    {
      sender: 'CANDIDATE',
      text: 'I’ll verify cgroups CPU limits first, check the disk pressure stats, and look at thread...',
      time: '10:39 PM',
      type: 'candidate'
    }
  ]);
  newMessage = signal<string>('');

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      if (this.secondsRemaining() > 0) {
        this.secondsRemaining.update(v => v - 1);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  toggleVoiceMode() {
    this.isVoiceMode.update(v => !v);
  }

  updateNewMessage(event: any) {
    this.newMessage.set(event.target.value);
  }

  sendChatMessage() {
    const text = this.newMessage().trim();
    if (!text) return;

    // Append candidate chat message
    this.chatMessages.update(msgs => [
      ...msgs,
      { sender: 'CANDIDATE', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'candidate' }
    ]);
    this.newMessage.set('');

    // Simulate real-time AI response stream
    setTimeout(() => {
      this.chatMessages.update(msgs => [
        ...msgs,
        { sender: 'GEMINI ENTERPRISE AI', text: 'Acknowledged. Proceeding with log trace analysis and cgroups verification.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'ai' }
      ]);
    }, 1000);
  }

  openVoiceSwitchModal() {
    if (this.isVoiceMode()) {
      // Direct toggle back to chat if currently in voice mode
      this.isVoiceMode.set(false);
    } else {
      // Open modal when switching from Chat to Voice
      this.selectedVoiceReason.set('');
      this.otherReasonText.set('');
      this.isVoiceSwitchModalOpen.set(true);
    }
  }

  closeVoiceSwitchModal() {
    this.isVoiceSwitchModalOpen.set(false);
  }

  selectVoiceReason(reason: string) {
    this.selectedVoiceReason.set(reason);
  }

  updateOtherReason(event: any) {
    this.otherReasonText.set(event.target.value);
  }

  confirmSwitchToVoice() {
    this.isVoiceMode.set(true);
    this.closeVoiceSwitchModal();
  }

  toggleMicModal() {
    this.isMicModalOpen.set(true);
  }

  closeMicModal() {
    this.isMicModalOpen.set(false);
  }

  unmuteMic() {
    this.isMicMuted.set(false);
    this.isMicModalOpen.set(false);
  }

  toggleDiagnosticModal() {
    this.isDiagnosticModalOpen.update(v => !v);
  }

  closeDiagnosticModal() {
    this.isDiagnosticModalOpen.set(false);
  }

  toggleTelemetryModal() {
    this.isTelemetryModalOpen.update(v => !v);
  }
  
  closeTelemetryModal() {
    this.isTelemetryModalOpen.set(false);
  }

  toggleTranscriptModal() {
    this.isTranscriptModalOpen.update(v => !v);
  }

  closeTranscriptModal() {
    this.isTranscriptModalOpen.set(false);
  }

  toggleHelpModal() {
    this.isHelpModalOpen.update(v => !v);
  }

  closeHelpModal() {
    this.isHelpModalOpen.set(false);
  }

  savePrivateNotes() {
    console.log('Private notes saved');
    this.closeTranscriptModal();
  }

  requestRephrase() {
    console.log('Rephrase requested');
  }

  finalizeRca() {
    console.log('RCA Finalized');
  }
}

