import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})

/**
 * Lightbox Component
 */
export class LightboxComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  images: { src: string; thumb: string; caption: string }[] = [];
  gallery: { src: string; thumb: string; caption: string }[] = [];

  constructor(private _lightbox: Lightbox, private modalService: NgbModal) {
    /**
     * Single Image Lightbox
     */
    for (let i = 1; i <= 2; i++) {
      const src = '../../../assets/images/small/img-' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';
      const thumb = '../../../assets/images/small/img-' + i + '.jpg';
      const album = {
        src,
        caption,
        thumb
      };
      this.images.push(album);
    }

    /**
     * Images with Description
     */
    for (let i = 1; i <= 4; i++) {
      const src = '../../../assets/images/small/img-' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';
      const thumb = '../../../assets/images/small/img-' + i + '.jpg';
      const album = {
        src,
        caption,
        thumb
      };
      this.gallery.push(album);
    }
  }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Extended' },
      { label: 'Lightbox', active: true }
    ];
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag)
  }

  /**
   * Open lightbox
   */
  openImage(index: number): void {
    // open lightbox
    this._lightbox.open(this.images, index, {
      showZoom: true
    });

  }

  /**
   * Open ZoomGallery lightbox
   */
  openZoomGallery(index: number): void {
    // open lightbox
    this._lightbox.open(this.gallery, index, {
      wrapAround: true, showImageNumberLabel: true
    });
  }

  /**
   * Open modal
   * @param content modal content
   */
  openYoutubeModal(content: any) {
    this.modalService.open(content, { size: 'lg', windowClass: 'modal-holder', centered: true });
  }
}
