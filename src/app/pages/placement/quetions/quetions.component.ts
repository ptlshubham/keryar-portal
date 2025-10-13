import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quetions',
  templateUrl: './quetions.component.html',
  styleUrls: ['./quetions.component.scss']
})
export class QuetionsComponent implements OnInit {
  validationForm!: FormGroup;
  isOpen = false;
  isUpdate = false;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  questionData: any[] = [{
    question_text: '',
    option_type: '',
    weight: null,
    time: null,
    optionsArr: [{ options: '', value: 0, isCorrect: false }],
    correctAnswer: null
  }];
  questionModel: any = {};
  viewQuestions: any = {};

  categories: any[] = [];
  subcategories: any[] = [];
  subtosubcategories: any[] = [];
  questionsSetData: any = [];

  // Store original data for lookups
  allSubcategories: any[] = [];
  allSubtosubcategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private placementService: PlacementService
  ) { }

  ngOnInit(): void {
    this.validationForm = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(1)]],
      year: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      subtosubcategory: ['', Validators.required],
      difficulty: ['', Validators.required]
    });

    this.validationForm.get('subcategory')?.disable();
    this.validationForm.get('subtosubcategory')?.disable();

    this.loadAllData();
  }

  get f() { return this.validationForm.controls; }

  get isQuestionValid(): boolean {
    const enteredQuestions = this.questionData.filter(q => q.question_text && q.question_text.trim().length > 0);
    if (enteredQuestions.length === 0) return false;

    return enteredQuestions.every(q => {
      // Basic validation for weight and time - allow 0 for weight
      const hasValidWeight = q.weight !== null && q.weight !== undefined && q.weight !== '' && Number(q.weight) >= 0;
      const hasValidTime = q.time !== null && q.time !== undefined && q.time !== '' && Number(q.time) > 0;

      if (!hasValidWeight || !hasValidTime) return false;

      // Validation based on option type
      if (q.option_type === 'Checkbox') {
        // For checkbox: must have options with text and values, at least one must be correct
        const validOptions = q.optionsArr.filter((opt: any) =>
          opt.options && opt.options.trim().length > 0 &&
          opt.value !== null && opt.value !== undefined && opt.value !== ''
        );

        // Check if at least one option is marked as correct
        const hasCorrectOption = q.optionsArr.some((opt: any) => {
          return opt.isCorrect === true || opt.isCorrect === 'true' || opt.isCorrect === 1;
        });

        return validOptions.length > 0 && hasCorrectOption;
      }

      if (q.option_type === 'Radio') {
        // For radio: must have options with text and values, one must be selected as correct
        const validOptions = q.optionsArr.filter((opt: any) =>
          opt.options && opt.options.trim().length > 0 &&
          opt.value !== null && opt.value !== undefined && opt.value !== ''
        );
        return validOptions.length > 0 && q.correctAnswer !== null && q.correctAnswer !== undefined;
      }

      if (q.option_type === 'Input' || q.option_type === 'Textarea') {
        // For input/textarea: must have correct answer
        return q.correctAnswer !== null && q.correctAnswer?.trim().length > 0;
      }

      // If no option type selected, it's invalid
      return q.option_type && q.option_type.trim().length > 0;
    });
  }

  get isFormValid(): boolean {
    return this.validationForm.valid && this.isQuestionValid;
  }

  get totalWeight(): number {
    return this.questionData
      .filter(q => q.question_text && q.question_text.trim().length > 0 && q.weight !== null && q.weight !== '')
      .reduce((sum, q) => sum + (Number(q.weight) || 0), 0);
  }

  get totalTime(): number {
    return this.questionData
      .filter(q => q.question_text && q.question_text.trim().length > 0 && q.time !== null && q.time !== '')
      .reduce((sum, q) => sum + (Number(q.time) || 0), 0);
  }

  get validQuestionsCount(): number {
    return this.questionData.filter(q => q.question_text && q.question_text.trim().length > 0).length;
  }

  fromCharCode(code: number): string {
    return String.fromCharCode(code);
  }

  loadAllData() {
    this.placementService.getAllActivePlacementCategory().subscribe({
      next: (res: any) => {
        this.categories = res;
        console.log('Fetched categories:', this.categories);
        this.loadSubcategories();
      },
      error: (err) => {
        this.toastr.error('Failed to fetch categories', 'Error');
        console.error('Error fetching categories:', err);
      }
    });
  }

  loadSubcategories() {
    this.placementService.getAllActiveSubCategory().subscribe({
      next: (res: any) => {
        this.allSubcategories = res.data; // Store original data
        this.subcategories = res.data;
        console.log('Fetched subcategories:', this.subcategories);
        this.loadSubToSubcategories();
      },
      error: (err) => {
        this.toastr.error('Failed to fetch subcategories', 'Error');
        console.error('Error fetching subcategories:', err);
      }
    });
  }

  loadSubToSubcategories() {
    this.placementService.getAllActiveSubToSubCategory().subscribe({
      next: (res: any) => {
        this.allSubtosubcategories = res.data.map((ssc: any) => ({
          id: ssc.id,
          name: ssc.name,
          subcategoriesid: ssc.subcategoriesid
        })); // Store original data
        this.subtosubcategories = [...this.allSubtosubcategories];
        console.log('Fetched sub-to-sub categories:', this.subtosubcategories);
        this.getAllSelfQuestionSetDetails();
      },
      error: (err) => {
        this.toastr.error('Failed to fetch sub-to-sub categories', 'Error');
        console.error('Error fetching sub-to-sub categories:', err);
      }
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  }

  getSubcategoryName(subcategoryId: string): string {
    // Use allSubcategories for lookup to avoid N/A when arrays are filtered
    const subcategory = this.allSubcategories.find(sub => sub.id === subcategoryId);
    return subcategory ? subcategory.name : 'N/A';
  }

  getSubToSubcategoryName(subtosubcategoryId: string): string {
    // Use allSubtosubcategories for lookup to avoid N/A when arrays are filtered
    const subtosubcategory = this.allSubtosubcategories.find(subsub => subsub.id === subtosubcategoryId);
    return subtosubcategory ? subtosubcategory.name : 'N/A';
  }

  onCategoryChange(categoryId: any) {
    this.subcategories = [];
    this.subtosubcategories = [];
    this.validationForm.patchValue({ subcategory: '', subtosubcategory: '' });
    this.validationForm.get('subcategory')?.disable();
    this.validationForm.get('subtosubcategory')?.disable();

    if (categoryId) {
      // Filter from allSubcategories instead of making API call
      this.subcategories = this.allSubcategories.filter((sc: any) => sc.categoriesid === categoryId);
      console.log('Filtered subcategories:', this.subcategories);
      if (this.subcategories.length > 0) {
        this.validationForm.get('subcategory')?.enable();
      }
    }
  }

  onSubcategoryChange(subcategoryId: any) {
    this.subtosubcategories = [];
    this.validationForm.patchValue({ subtosubcategory: '' });
    this.validationForm.get('subtosubcategory')?.disable();

    if (subcategoryId) {
      // Filter from allSubtosubcategories instead of making API call
      this.subtosubcategories = this.allSubtosubcategories
        .filter((ssc: any) => ssc.subcategoriesid === subcategoryId)
        .map((ssc: any) => ({
          id: ssc.id,
          name: ssc.name
        }));
      console.log('Filtered sub-to-sub categories:', this.subtosubcategories);
      if (this.subtosubcategories.length > 0) {
        this.validationForm.get('subtosubcategory')?.enable();
      }
    }
  }

  openQuestionset() {
    this.isOpen = true;
    this.isUpdate = false;
    this.formReset();
  }

  closeQuestionset() {
    this.isOpen = false;
    this.isUpdate = false;
    this.formReset();
  }

  addQuestion() {
    this.questionData.push({
      question_text: '',
      option_type: '',
      weight: null,
      time: null,
      optionsArr: [{ options: '', value: 0, isCorrect: false }],
      correctAnswer: null
    });
  }

  removeQuestion(index: number) {
    if (this.questionData.length > 1) {
      this.questionData.splice(index, 1);
    }
  }

  addOption(qIndex: number) {
    if (!this.questionData[qIndex].optionsArr) {
      this.questionData[qIndex].optionsArr = [];
    }
    this.questionData[qIndex].optionsArr.push({ options: '', value: 0, isCorrect: false });
  }

  removeOption(qIndex: number, optIndex: number) {
    if (this.questionData[qIndex].optionsArr && this.questionData[qIndex].optionsArr.length > 1) {
      this.questionData[qIndex].optionsArr.splice(optIndex, 1);
    }
  }

  onOptionValueChange(qIndex: number, optIndex: number, value: any) {
    // Ensure value is never negative and is a valid number
    const numValue = Number(value);
    if (numValue < 0 || isNaN(numValue)) {
      this.questionData[qIndex].optionsArr[optIndex].value = 0;
    } else {
      this.questionData[qIndex].optionsArr[optIndex].value = numValue;
    }
  }

  onCheckboxChange(qIndex: number, optIndex: number, isChecked: boolean) {
    this.questionData[qIndex].optionsArr[optIndex].isCorrect = isChecked;
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
    if ([8, 9, 27, 13, 46, 35, 36, 37, 39, 38, 40].indexOf(charCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
      (charCode === 65 && event.ctrlKey === true) || // Ctrl+A
      (charCode === 67 && event.ctrlKey === true) || // Ctrl+C
      (charCode === 86 && event.ctrlKey === true) || // Ctrl+V
      (charCode === 88 && event.ctrlKey === true) || // Ctrl+X
      (charCode === 90 && event.ctrlKey === true)) { // Ctrl+Z
      return true;
    }
    // Ensure that it is a number and stop the keypress
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  getTotalMarks(questionSet: any): number {
    if (!questionSet.questions || questionSet.questions.length === 0) {
      return 0;
    }
    return questionSet.questions.reduce((total: number, question: any) => {
      return total + (Number(question.weight) || 0);
    }, 0);
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];

    if (!this.validationForm.valid) {
      if (this.validationForm.get('type')?.invalid) errors.push('Type is required');
      if (this.validationForm.get('year')?.invalid) errors.push('Year is required');
      if (this.validationForm.get('category')?.invalid) errors.push('Category is required');
      if (this.validationForm.get('subcategory')?.invalid) errors.push('Subcategory is required');
      if (this.validationForm.get('subtosubcategory')?.invalid) errors.push('Sub-to-subcategory is required');
      if (this.validationForm.get('difficulty')?.invalid) errors.push('Difficulty is required');
    }

    const enteredQuestions = this.questionData.filter(q => q.question_text && q.question_text.trim().length > 0);
    if (enteredQuestions.length === 0) {
      errors.push('At least one question is required');
    } else {
      enteredQuestions.forEach((q, index) => {
        // Allow weight to be 0 or greater
        if (q.weight === null || q.weight === undefined || q.weight === '' || Number(q.weight) < 0) {
          errors.push(`Question ${index + 1}: Weight must be 0 or greater`);
        }
        if (!q.time || Number(q.time) <= 0) {
          errors.push(`Question ${index + 1}: Time must be greater than 0`);
        }
        if (!q.option_type) {
          errors.push(`Question ${index + 1}: Option type is required`);
        } else if (q.option_type === 'Checkbox') {
          const validOptions = q.optionsArr.filter((opt: any) =>
            opt.options && opt.options.trim().length > 0 &&
            opt.value !== null && opt.value !== undefined && opt.value !== ''
          );

          const hasCorrectOption = q.optionsArr.some((opt: any) => {
            return opt.isCorrect === true || opt.isCorrect === 'true' || opt.isCorrect === 1;
          });

          if (validOptions.length === 0) {
            errors.push(`Question ${index + 1}: At least one option with text and value is required`);
          }
          if (!hasCorrectOption) {
            errors.push(`Question ${index + 1}: At least one correct option must be selected`);
          }
        } else if (q.option_type === 'Radio') {
          const validOptions = q.optionsArr.filter((opt: any) =>
            opt.options && opt.options.trim().length > 0 &&
            opt.value !== null && opt.value !== undefined && opt.value !== ''
          );
          if (validOptions.length === 0) {
            errors.push(`Question ${index + 1}: At least one option with text and value is required`);
          }
          if (q.correctAnswer === null || q.correctAnswer === undefined) {
            errors.push(`Question ${index + 1}: One correct answer must be selected`);
          }
        } else if (q.option_type === 'Input' || q.option_type === 'Textarea') {
          if (!q.correctAnswer || q.correctAnswer.trim().length === 0) {
            errors.push(`Question ${index + 1}: Correct answer is required`);
          }
        }
      });
    }

    return errors;
  }





  saveQuestionList() {
    if (this.isFormValid) {
      // Calculate total time
      const totalTime = this.questionData
        .filter(q => q.question_text && q.question_text.trim().length > 0)
        .reduce((sum, q) => sum + (Number(q.time) || 0), 0);

      let data = {
        type: this.validationForm.value.type,
        categoriesid: this.validationForm.value.category,
        subcategoriesid: this.validationForm.value.subcategory,
        subtosubcategoriesid: this.validationForm.value.subtosubcategory,
        difficulty: this.validationForm.value.difficulty,
        totalTime: totalTime,
        questions: this.questionData.filter(q => q.question_text && q.question_text.trim().length > 0).map((q, qIndex) => ({
          question_text: q.question_text,
          option_type: q.option_type,
          weight: q.weight,
          time: q.time,
          sequence: qIndex + 1,
          optionsArr: q.optionsArr?.map((opt: any, optIndex: number) => ({
            options: opt.options, // Changed from option_text to options
            value: opt.value,
            isCorrect: opt.isCorrect,
            option_sequence: optIndex + 1
          })) || [],
          correctAnswer: q.correctAnswer
        })),
        year: this.validationForm.value.year ? this.validationForm.value.year.split('-')[0] : new Date().getFullYear().toString()
      };

      this.placementService.saveSelfAssessmentQuestionSetDetails(data).subscribe({
        next: (res: any) => {
          this.formReset();
          this.loadAllData();
          this.isUpdate = false;
          this.isOpen = false;
          this.toastr.success('Question set saved successfully.');
        },
        error: (err) => {
          this.toastr.error('Error saving question set: ' + (err.error?.message || err.message), 'Error');
        }
      });
    } else {
      let msg = '';
      if (!this.validationForm.valid) {
        msg += 'Please fill all required fields (Type, Year, Difficulty, Category, Subcategory, Sub-to-subcategory). ';
      }
      if (!this.isQuestionValid) {
        msg += 'Please enter at least one question with valid weight, time (in minutes), and correct answer.';
      }
      this.toastr.error(msg || 'Please complete the form correctly.', 'Validation Error');
    }
  }

  formReset() {
    this.validationForm.reset({
      type: '',
      year: '',
      category: '',
      subcategory: '',
      subtosubcategory: '',
      difficulty: ''
    });
    this.validationForm.get('subcategory')?.disable();
    this.validationForm.get('subtosubcategory')?.disable();
    this.questionData = [{
      question_text: '',
      option_type: '',
      weight: null,
      time: null,
      optionsArr: [{ options: '', value: 0, isCorrect: false }],
      correctAnswer: null
    }];
    // Restore original data instead of clearing arrays
    this.subcategories = [...this.allSubcategories];
    this.subtosubcategories = [...this.allSubtosubcategories];
  }

  getAllSelfQuestionSetDetails() {
    this.placementService.getAllSelfQuestionSetDetails().subscribe({
      next: (res: any) => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].index = i + 1;

          // Ensure proper ordering of questions and options
          if (res.data[i].questions) {
            // Questions are already ordered by sequence in the backend API
            res.data[i].questions = res.data[i].questions.map((q: any) => {
              // Don't sort optionsArr - keep the original sequence order from backend
              return {
                ...q,
                optionsArr: q.optionsArr || []
              };
            });
          }
        }
        this.questionsSetData = res.data;
        this.collectionSize = this.questionsSetData.length;
        this.getPagintaion();
      },
      error: (err) => {
        this.toastr.error('Error fetching question sets: ' + (err.error?.message || err.message), 'Error');
      }
    });
  }

  getPagintaion() {
    this.paginateData = this.questionsSetData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openQuestionList(exlargeModal: any, data: any) {
    // Backend already provides data in correct sequence order - don't modify it
    this.viewQuestions = JSON.parse(JSON.stringify(data)); // Deep copy to avoid reference issues
    this.modalService.open(exlargeModal, { size: 'lg', windowClass: 'modal-holder', centered: true });
  }

  removeSelfAssessmentQuestionSet(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this question set?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.placementService.removeSelfAssessmentQuestionSet(id).subscribe({
          next: (res: any) => {
            this.loadAllData();
            this.getAllSelfQuestionSetDetails();
            this.toastr.success('Question set removed successfully.');
          },
          error: (err) => {
            this.toastr.error('Error removing question set: ' + (err.error?.message || err.message), 'Error');
          }
        });
      }
    });
  }

  editQuestionSet(data: any) {
    this.questionModel = { ...data };

    // Set basic form values first
    this.validationForm.patchValue({
      type: data.type,
      year: data.year ? `${data.year}-01` : '',
      category: data.categoriesid,
      difficulty: data.difficulty
    });

    // Backend already provides questions in correct sequence order
    this.questionData = data.questions.map((q: any) => ({
      queid: q.id,
      question_text: q.question_text,
      option_type: q.option_type,
      weight: q.weight,
      time: q.time, // Time in minutes
      optionsArr: q.optionsArr?.map((opt: any, optIndex: number) => ({
        id: opt.id,
        options: opt.options,
        value: opt.value,
        isCorrect: opt.isCorrect
      })) || [],
      correctAnswer: q.option_type === 'Radio' ? q.correctAnswer : q.correctAnswer
    }));

    this.isUpdate = true;
    this.isOpen = true;

    // Load subcategories for the selected category
    if (data.categoriesid) {
      // Filter from allSubcategories instead of making API call
      this.subcategories = this.allSubcategories.filter((sc: any) => sc.categoriesid === data.categoriesid);
      console.log('Filtered subcategories for edit:', this.subcategories);

      if (this.subcategories.length > 0) {
        this.validationForm.get('subcategory')?.enable();

        // Set the subcategory value after subcategories are loaded
        setTimeout(() => {
          this.validationForm.patchValue({ subcategory: data.subcategoriesid });
        }, 100);

        // Load sub-to-sub categories for the selected subcategory
        if (data.subcategoriesid) {
          // Filter from allSubtosubcategories instead of making API call
          this.subtosubcategories = this.allSubtosubcategories
            .filter((ssc: any) => ssc.subcategoriesid === data.subcategoriesid)
            .map((ssc: any) => ({
              id: ssc.id,
              name: ssc.name
            }));
          console.log('Filtered sub-to-sub categories for edit:', this.subtosubcategories);

          if (this.subtosubcategories.length > 0) {
            this.validationForm.get('subtosubcategory')?.enable();

            // Set the sub-to-sub category value after data is loaded
            setTimeout(() => {
              this.validationForm.patchValue({ subtosubcategory: data.subtosubcategoriesid });
            }, 150);
          }
        }
      }
    }
  }

  updateSelfQuestionSet() {
    if (this.isFormValid) {
      // Calculate total time
      const totalTime = this.questionData
        .filter(q => q.question_text && q.question_text.trim().length > 0)
        .reduce((sum, q) => sum + (Number(q.time) || 0), 0);

      const data = {
        id: this.questionModel.id,
        type: this.validationForm.value.type,
        categoriesid: this.validationForm.value.category,
        subcategoriesid: this.validationForm.value.subcategory,
        subtosubcategoriesid: this.validationForm.value.subtosubcategory,
        difficulty: this.validationForm.value.difficulty,
        totalTime: totalTime,
        questions: this.questionData
          .filter(q => q.question_text && q.question_text.trim().length > 0)
          .map((q, qIndex) => ({
            queid: q.queid,
            question_text: q.question_text,
            option_type: q.option_type,
            weight: q.weight,
            time: q.time,
            sequence: qIndex + 1,
            optionsArr: q.optionsArr?.map((opt: any, optIndex: number) => ({
              id: opt.id,
              options: opt.options, // Changed from option_text to options
              value: opt.value,
              isCorrect: opt.isCorrect,
              option_sequence: optIndex + 1
            })) || [],
            correctAnswer: q.correctAnswer
          })),
        year: this.validationForm.value.year ? this.validationForm.value.year.split('-')[0] : new Date().getFullYear().toString()
      };

      this.placementService.updateSelfAssessmentQuestionSetDetails(data).subscribe({
        next: (res: any) => {
          this.toastr.success('Question set updated successfully.');
          this.loadAllData();
          this.formReset();
          this.isOpen = false;
          this.isUpdate = false;
        },
        error: (err) => {
          this.toastr.error('Error updating question set: ' + (err.error?.message || err.message), 'Error');
        }
      });
    } else {
      // Show validation errors
      const errors = this.getValidationErrors();
      console.log('Validation errors:', errors);
      this.toastr.error('Please fix the following errors:\n' + errors.join('\n'), 'Validation Error');
    }
  }
}