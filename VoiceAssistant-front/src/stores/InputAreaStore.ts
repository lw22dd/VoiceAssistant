import { defineStore } from 'pinia';

export const useInputAreaStore = defineStore('inputArea', {
  state: () => ({
    isCalling: false,
    isRecording: true,
    callStartTime: null as number | null,
    timerInterval: null as number | null,
    callDuration: '00:00',
    inputText: '',
    showDialPad: false
  }),
  getters: {
    callStatusText: (state) => state.isCalling ? '通话中' : '已结束'
  },
  actions: {
    startCallTimer() {
      this.isRecording = true;
      this.isCalling = true;
      this.callStartTime = Date.now();
      
      this.timerInterval = setInterval(() => {
        if (this.callStartTime) {
          const durationMs = Date.now() - this.callStartTime;
          const minutes = Math.floor(durationMs / 60000);
          const seconds = Math.floor((durationMs % 60000) / 1000);
          this.callDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      }, 1000) as unknown as number;
    },
    
    stopCallTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
    
    resetCallTimer() {
      this.stopCallTimer();
      this.callStartTime = null;
      this.callDuration = '00:00';
    },
    
    toggleCallStatus() {
      this.isCalling = !this.isCalling;
    },
    
    toggleRecordingStatus() {
      this.isRecording = !this.isRecording;
    }
  }
});