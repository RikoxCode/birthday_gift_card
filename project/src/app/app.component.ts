import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatIcon} from "@angular/material/icon";

class Time{
  public minutes: number = 0;
  public seconds: number = 0;

  constructor(minutes: number, seconds: number){
    this.minutes = minutes;
    this.seconds = seconds;
  }

  public toString(): string{
    if(this.seconds < 10 && this.minutes < 10){
      return `0${this.minutes}:0${this.seconds}`;
    }

    if(this.seconds < 10){
      return `${this.minutes}:0${this.seconds}`;
    }

    if(this.minutes < 10){
      return `0${this.minutes}:${this.seconds}`;
    }

    return `${this.minutes}:${this.seconds}`;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIcon],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'birthday';
  isPlaying = false;
  isPaused = false;
  audio = new Audio();
  isMuted = false;

  currentTime = signal(new Time(0, 0));
  audioProgress = signal(0);

  playAudio(): void {
    this.audio.src = 'assets/liqwyd-birthday(chosic.com).mp3';
    this.audio.load();
    this.isPlaying = true;
    this.isPaused = false;
    this.audio.play();
    this.audio.addEventListener('ended', this.audioEnded.bind(this));
    this.audio.addEventListener('timeupdate', this.calculateProgress.bind(this));
    this.audio.addEventListener('timeupdate', this.calculateTime.bind(this));
  }

  private calculateTime(event: Event): void {
    const currentTime = (event.target as HTMLAudioElement).currentTime;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    this.currentTime.set(new Time(minutes, seconds));
  }

  private calculateProgress(event: Event): void {
    const currentTime = (event.target as HTMLAudioElement).currentTime;
    const progress = (currentTime / this.audio.duration) * 100;
    this.audioProgress.set(progress);
  }

  audioEnded(): void {
    this.isPlaying = false;
    this.isPaused = false;
  }

  resetPause(): void {
    this.isPaused = false;
    this.isPlaying = true;
    this.audio.play();
  }

  pauseAudio(): void {
    this.audio.pause();
    this.isPlaying = false;
    this.isPaused = true;
  }

  stopAudio(): void {
    this.audio.pause();
    this.isPlaying = false;
    this.isPaused = false;
    this.audio.currentTime = 0;
  }

  changeVolume(event: Event): void {
    const volume = (event.target as HTMLInputElement).value;
    this.audio.volume = parseInt(volume, 10) / 100;
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
  }
}
