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

  questionData: any[] = [{ question_text: null, option_type: '', weight: null, optionsArr: [{ options: '', value: null, isCorrect: false }], correctAnswer: null }];
  questionModel: any = {};
  viewQuestions: any = {};

  categories: any[] = [];
  subcategories: any[] = [];
  subtosubcategories: any[] = [];
  questionsSetData: any = [];

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
    return enteredQuestions.every(q =>
      q.weight !== null && q.weight !== undefined && q.weight.toString().trim().length > 0 &&
      (q.option_type === 'Checkbox' || q.option_type === 'Radio' ? q.optionsArr.length > 0 : true) &&
      (q.option_type === 'Radio' ? q.correctAnswer !== null && q.correctAnswer !== undefined : true) &&
      (q.option_type === 'Input' || q.option_type === 'Textarea' ? q.correctAnswer !== null && q.correctAnswer?.trim().length > 0 : true)
    );
  }

  get isFormValid(): boolean {
    return this.validationForm.valid && this.isQuestionValid;
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
        this.subtosubcategories = res.data.map((ssc: any) => ({
          id: ssc.id,
          name: ssc.name,
          subcategoriesid: ssc.subcategoriesid
        }));
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
    const subcategory = this.subcategories.find(sub => sub.id === subcategoryId);
    return subcategory ? subcategory.name : 'N/A';
  }

  getSubToSubcategoryName(subtosubcategoryId: string): string {
    const subtosubcategory = this.subtosubcategories.find(subsub => subsub.id === subtosubcategoryId);
    return subtosubcategory ? subtosubcategory.name : 'N/A';
  }

  onCategoryChange(categoryId: any) {
    this.subcategories = [];
    this.subtosubcategories = [];
    this.validationForm.patchValue({ subcategory: '', subtosubcategory: '' });
    this.validationForm.get('subcategory')?.disable();
    this.validationForm.get('subtosubcategory')?.disable();

    if (categoryId) {
      this.placementService.getAllActiveSubCategory().subscribe({
        next: (res: any) => {
          this.subcategories = res.data.filter((sc: any) => sc.categoriesid === categoryId);
          console.log('Filtered subcategories:', this.subcategories);
          if (this.subcategories.length > 0) {
            this.validationForm.get('subcategory')?.enable();
          }
        },
        error: (err) => {
          this.toastr.error('Failed to fetch subcategories', 'Error');
          console.error('Error fetching subcategories:', err);
        }
      });
    }
  }

  onSubcategoryChange(subcategoryId: any) {
    this.subtosubcategories = [];
    this.validationForm.patchValue({ subtosubcategory: '' });
    this.validationForm.get('subtosubcategory')?.disable();

    if (subcategoryId) {
      this.placementService.getAllActiveSubToSubCategory().subscribe({
        next: (res: any) => {
          this.subtosubcategories = res.data
            .filter((ssc: any) => ssc.subcategoriesid === subcategoryId)
            .map((ssc: any) => ({
              id: ssc.id,
              name: ssc.name
            }));
          console.log('Filtered sub-to-sub categories:', this.subtosubcategories);
          if (this.subtosubcategories.length > 0) {
            this.validationForm.get('subtosubcategory')?.enable();
          }
        },
        error: (err) => {
          this.toastr.error('Failed to fetch sub-to-sub categories', 'Error');
          console.error('Error fetching sub-to-sub categories:', err);
        }
      });
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
    this.questionData.push({ question_text: null, option_type: '', weight: null, optionsArr: [{ options: '', value: null, isCorrect: false }], correctAnswer: null });
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
    this.questionData[qIndex].optionsArr.push({ options: '', value: null, isCorrect: false });
  }

  removeOption(qIndex: number, optIndex: number) {
    if (this.questionData[qIndex].optionsArr && this.questionData[qIndex].optionsArr.length > 1) {
      this.questionData[qIndex].optionsArr.splice(optIndex, 1);
    }
  }

  saveQuestionList() {
    if (this.isFormValid) {
      let data = {
        type: this.validationForm.value.type,
        categoriesid: this.validationForm.value.category,
        subcategoriesid: this.validationForm.value.subcategory,
        subtosubcategoriesid: this.validationForm.value.subtosubcategory,
        difficulty: this.validationForm.value.difficulty,
        questions: this.questionData.filter(q => q.question_text && q.question_text.trim().length > 0).map(q => ({
          question_text: q.question_text,
          option_type: q.option_type,
          weight: q.weight,
          optionsArr: q.optionsArr?.map((opt: any) => ({
            options: opt.options,
            value: opt.value,
            isCorrect: opt.isCorrect
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
          this.toastr.error('Error saving question set.', 'Error');
          console.error('Error saving question set:', err);
        }
      });
    } else {
      let msg = '';
      if (!this.validationForm.valid) {
        msg += 'Please fill all required fields (Type, Year, Difficulty, Category, Subcategory, Sub-to-subcategory). ';
      }
      if (!this.isQuestionValid) {
        msg += 'Please enter at least one question with a valid weight and correct answer.';
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
      question_text: null,
      option_type: '',
      weight: null,
      optionsArr: [{ options: '', value: null, isCorrect: false }],
      correctAnswer: null
    }];
    this.subcategories = [];
    this.subtosubcategories = [];
  }

  getAllSelfQuestionSetDetails() {
    this.placementService.getAllSelfQuestionSetDetails().subscribe({
      next: (res: any) => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].index = i + 1;
        }
        this.questionsSetData = res.data;
        this.collectionSize = this.questionsSetData.length;
        this.getPagintaion();
      },
      error: (err) => {
        this.toastr.error('Error fetching question sets.', 'Error');
        console.error('Error fetching question sets:', err);
      }
    });
  }

  getPagintaion() {
    this.paginateData = this.questionsSetData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openQuestionList(exlargeModal: any, data: any) {
    this.viewQuestions = { ...data };
    this.modalService.open(exlargeModal, { size: 'lg', windowClass: 'modal-holder', centered: true });
  }


  removeSelfAssessmentQuestionSet(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this job opening?',
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
            this.toastr.error('Error removing question set.', 'Error');
            console.error('Error removing question set:', err);
          }
        });
      }
    });
  }

  editQuestionSet(data: any) {
    this.questionModel = { ...data };
    this.validationForm.patchValue({
      type: data.type,
      year: data.year ? `${data.year}-01` : '',
      category: data.categoriesid,
      subcategory: data.subcategoriesid,
      subtosubcategory: data.subtosubcategoriesid,
      difficulty: data.difficulty
    });
    this.questionData = data.questions.map((q: any) => ({
      queid: q.id,
      question_text: q.question_text,
      option_type: q.option_type,
      weight: q.weight,
      optionsArr: q.optionsArr?.map((opt: any) => ({
        id: opt.id,
        options: opt.options,
        value: opt.value,
        isCorrect: opt.isCorrect
      })) || [],
      correctAnswer: q.correctAnswer
    }));
    this.isUpdate = true;
    this.isOpen = true;

    if (data.categoriesid) {
      this.placementService.getAllActiveSubCategory().subscribe({
        next: (res: any) => {
          this.subcategories = res.data.filter((sc: any) => sc.categoriesid === data.categoriesid);
          console.log('Filtered subcategories:', this.subcategories);
          if (this.subcategories.length > 0) {
            this.validationForm.get('subcategory')?.enable();
            this.validationForm.patchValue({ subcategory: data.subcategoriesid });
          }
          if (data.subcategoriesid) {
            this.placementService.getAllActiveSubToSubCategory().subscribe({
              next: (res: any) => {
                this.subtosubcategories = res.data
                  .filter((ssc: any) => ssc.subcategoriesid === data.subcategoriesid)
                  .map((ssc: any) => ({
                    id: ssc.id,
                    name: ssc.name
                  }));
                console.log('Filtered sub-to-sub categories:', this.subtosubcategories);
                if (this.subtosubcategories.length > 0) {
                  this.validationForm.get('subtosubcategory')?.enable();
                  this.validationForm.patchValue({ subtosubcategory: data.subtosubcategoriesid });
                }
              },
              error: (err) => {
                this.toastr.error('Failed to fetch sub-to-sub categories', 'Error');
                console.error('Error fetching sub-to-sub categories:', err);
              }
            });
          }
        },
        error: (err) => {
          this.toastr.error('Failed to fetch subcategories', 'Error');
          console.error('Error fetching subcategories:', err);
        }
      });
    }
  }

  updateSelfQuestionSet() {
    const data = {
      id: this.questionModel.id,
      type: this.validationForm.value.type,
      categoriesid: this.validationForm.value.category,
      subcategoriesid: this.validationForm.value.subcategory,
      subtosubcategoriesid: this.validationForm.value.subtosubcategory,
      difficulty: this.validationForm.value.difficulty,
      questions: this.questionData
        .filter(q => q.question_text && q.question_text.trim().length > 0)
        .map(q => ({
          queid: q.queid,
          question_text: q.question_text,
          option_type: q.option_type,
          weight: q.weight,
          optionsArr: q.optionsArr?.map((opt: any) => ({
            id: opt.id,
            options: opt.options,
            value: opt.value,
            isCorrect: opt.isCorrect
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
        this.toastr.error('Error updating question set.', 'Error');
        console.error('Error updating question set:', err);
      }
    });
  }
}