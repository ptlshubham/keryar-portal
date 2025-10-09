import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { PlacementService } from 'src/app/core/services/placement.service';

@Component({
  selector: 'app-assessment',
  standalone: false,
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit, OnDestroy {
  questionSetId: string | null = null;
  placementFormId: string | null = null;
  questions: any[] = [];
  answers: { [key: string]: any } = {};
  timeLeft: number | null = null;
  timerSubscription: Subscription | null = null;
  student: { name: string; id: string } | null = null;
  isSubmitted = false;
  currentQuestionIndex = 0;
  isLoading = false; // Loading state for submit operation

  constructor(
    private route: ActivatedRoute,
    private placementService: PlacementService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.applyRestrictions();
    this.loadStudentData();
    this.questionSetId = this.route.snapshot.paramMap.get('questionSetId');
    this.placementFormId = this.route.snapshot.paramMap.get('placementFormId');
    // below for the back button of the browser

    // prevent back navigation
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', this.blockBack);
    // to this 
    if (this.questionSetId && this.placementFormId) {
      this.getAssessmentStatus();
    } else {
      this.toastr.error('Invalid assessment parameters.');
      this.router.navigate(['/placement/job-openings']);
    }
  }
  // below for the blockBack back button of the browser

  private blockBack = () => {
    history.pushState(null, '', window.location.href);
    this.toastr.warning('Back navigation is not allowed during the test.');
  };


  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
    this.removeRestrictions();
    // below for the back button of the browser
    window.removeEventListener('popstate', this.blockBack);
  }
  private loadStudentData() {
    const placementUserData = localStorage.getItem('placementUserData');
    if (placementUserData) {
      try {
        const userData = JSON.parse(placementUserData);
        if (userData.firstname && userData.lastname && userData.studentid) {
          this.student = {
            name: `${userData.firstname} ${userData.lastname}`,
            id: userData.studentid
          };
        } else {
          throw new Error('Incomplete student data.');
        }
      } catch {
        this.toastr.error('Invalid student data.');
        this.router.navigate(['/placement/job-openings']);
      }
    } else {
      this.toastr.error('No student data found.');
      this.router.navigate(['/placement/job-openings']);
    }
  }

  private applyRestrictions() {
    document.body.style.userSelect = 'none';
    document.addEventListener('contextmenu', this.preventDefault);
    document.addEventListener('copy', this.preventDefault);
    document.addEventListener('paste', this.preventDefault);
    window.addEventListener('beforeunload', this.confirmExit);
  }

  private removeRestrictions() {
    document.body.style.userSelect = '';
    document.removeEventListener('contextmenu', this.preventDefault);
    document.removeEventListener('copy', this.preventDefault);
    document.removeEventListener('paste', this.preventDefault);
    window.removeEventListener('beforeunload', this.confirmExit);
  }

  private preventDefault = (e: Event) => {
    e.preventDefault();
    this.toastr.warning('Action not allowed during the test.');
  };

  private confirmExit = (e: BeforeUnloadEvent) => {
    if (!this.isSubmitted) {
      e.preventDefault();
      e.returnValue = 'Your progress may not be saved. Are you sure you want to leave?';
    }
  };

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isSubmitted) return;
    if (event.key === 'F12' || (event.ctrlKey && ['c', 'v', 't'].includes(event.key))) {
      event.preventDefault();
      this.toastr.warning('Action not allowed during the test.');
    }
  }

  getAssessmentStatus() {
    this.placementService.getAssessmentStatus(this.placementFormId!, this.questionSetId!).subscribe({
      next: (response) => {
        if (response.success) {
          if (response.isSubmitted) {
            this.isSubmitted = true;
            this.toastr.error('Assessment already submitted.');
            this.router.navigate(['/home']);
          } else {
            this.timeLeft = response.remainingTime;
            this.fetchQuestions();
            this.fetchSavedAnswers();
          }
        } else {
          this.toastr.error(response.message || 'Failed to load assessment.');
          this.router.navigate(['/placement/job-openings']);
        }
      },
      error: () => {
        this.toastr.error('Error loading assessment.');
        this.router.navigate(['/placement/job-openings']);
      }
    });
  }

  fetchQuestions() {
    this.placementService.getQuestionSetDetails(this.questionSetId!).subscribe({
      next: (response) => {
        if (response.success && response.data.questions) {
          this.questions = response.data.questions;
          if (!this.questions.length) {
            this.toastr.warning('No questions found.');
          } else {
            this.questions.forEach(q => {
              if (q.option_type === 'Checkbox') {
                this.answers[q.id] = this.answers[q.id] || [];
              } else {
                this.answers[q.id] = this.answers[q.id] || '';
              }
            });
            this.startTimer();
          }
        } else {
          this.toastr.error('Failed to load questions.');
        }
      },
      error: () => this.toastr.error('Error fetching questions.')
    });
  }

  fetchSavedAnswers() {
    this.placementService.getSavedAnswers(this.placementFormId!, this.questionSetId!).subscribe({
      next: (response) => {
        if (response.success && response.answers) {
          this.answers = response.answers;
          this.toastr.info('Previous answers loaded.');
        }
      },
      error: () => this.toastr.error('Error loading saved answers.')
    });
  }

  startTimer() {
    if (this.timeLeft && this.timeLeft > 0) {
      this.timerSubscription = interval(1000).subscribe(() => {
        if (this.timeLeft && this.timeLeft > 0) {
          this.timeLeft--;
          if (this.timeLeft % 10 === 0) {
            this.saveProgress();
            this.updateRemainingTime();
          }
        } else {
          this.timerSubscription?.unsubscribe();
          this.submitAnswers();
        }
      });
    }
  }

  updateRemainingTime() {
    this.placementService.updateRemainingTime({
      placementFormId: this.placementFormId,
      questionSetId: this.questionSetId,
      remainingTime: this.timeLeft
    }).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Remaining time updated.');
        }
      },
      error: () => console.error('Error updating remaining time.')
    });
  }

  formatTime(seconds: number | null): string {
    if (seconds === null) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  onAnswerChange(questionId: string, value: any, type: string, checked?: boolean) {
    if (type === 'Checkbox') {
      // Initialize as array if not already
      if (!Array.isArray(this.answers[questionId])) {
        this.answers[questionId] = [];
      }
      
      if (checked) {
        // Add value if not already present
        if (!this.answers[questionId].includes(value)) {
          this.answers[questionId].push(value);
        }
      } else {
        // Remove value if present
        this.answers[questionId] = this.answers[questionId].filter((v: any) => v !== value);
      }
    } else {
      this.answers[questionId] = value;
    }
    this.saveProgress();
  }

  saveProgress() {
    this.placementService.saveProgress({
      placementFormId: this.placementFormId,
      questionSetId: this.questionSetId,
      answers: this.answers
    }).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Progress saved.');
        }
      },
      error: () => console.error('Error saving progress.')
    });
  }

  submitAnswers() {
    if (!Object.keys(this.answers).length) {
      this.toastr.warning('Please answer at least one question.');
      return;
    }
    this.isLoading = true; // Set loading to true
    this.placementService.submitAssessmentAnswers({
      placementFormId: this.placementFormId,
      questionSetId: this.questionSetId,
      answers: this.answers
    }).subscribe({
      next: (response) => {
        this.isLoading = false; // Reset loading state
        if (response.success) {
          this.isSubmitted = true;
          this.timerSubscription?.unsubscribe();
          this.toastr.success('Assessment submitted successfully.');
          localStorage.removeItem('placementUserData');
        } else {
          this.toastr.error(response.message || 'Failed to submit assessment.');
        }
      },
      error: () => {
        this.isLoading = false; // Reset loading state on error
        this.toastr.error('Error submitting assessment.');
      }
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.saveProgress();
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.saveProgress();
      this.currentQuestionIndex--;
    }
  }
  @HostListener('window:keyup', ['$event'])
  handleScreenshotKeys(event: KeyboardEvent) {
    // Detect PrintScreen
    if (event.key === 'PrintScreen') {
      this.blockScreen();
      this.toastr.warning('Screenshots are not allowed during the test.');
      setTimeout(() => this.unblockScreen(), 2000); // remove overlay after 2 sec
    }
  }

  blockScreen() {
    const blocker = document.createElement('div');
    blocker.id = 'screenshot-blocker';
    blocker.style.position = 'fixed';
    blocker.style.top = '0';
    blocker.style.left = '0';
    blocker.style.width = '100%';
    blocker.style.height = '100%';
    blocker.style.backgroundColor = 'black';
    blocker.style.zIndex = '9999';
    document.body.appendChild(blocker);
  }

  unblockScreen() {
    const blocker = document.getElementById('screenshot-blocker');
    if (blocker) blocker.remove();
  }

}