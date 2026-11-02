/**
 * Portfolio Interactive Scripts
 * Author: Reksi Hendra Pratama, S.Kom
 * Tech: Vanilla JavaScript ES6+
 * Features: ScrollSpy, Mobile Drawer, Project Filters, Case Study Modal,
 *           Credential Verification Modal, CV Preview, Counter Animation, Copy-to-Clipboard.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Elements Selection
  // -------------------------------------------------------------------------
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const backToTopBtn = document.getElementById('back-to-top');
  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  
  // Modals
  const caseStudyModal = document.getElementById('case-study-modal');
  const verifyModal = document.getElementById('verify-modal');
  const cvModal = document.getElementById('cv-modal');

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  // -------------------------------------------------------------------------
  // 2. Header Scroll & Back to Top
  // -------------------------------------------------------------------------
  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }

    if (scrollY > 380) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // -------------------------------------------------------------------------
  // 3. ScrollSpy Navigation
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const updateScrollSpy = () => {
    const scrollPos = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateScrollSpy, { passive: true });

  // -------------------------------------------------------------------------
  // 4. Mobile Drawer Menu
  // -------------------------------------------------------------------------
  const openMobileMenu = () => {
    mobileNavDrawer?.classList.add('open');
    mobileNavOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileNavDrawer?.classList.remove('open');
    mobileNavOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileMenuBtn?.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);
  mobileNavOverlay?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // -------------------------------------------------------------------------
  // 5. Toast Notification Utility
  // -------------------------------------------------------------------------
  let toastTimer = null;
  const showToast = (message = 'Berhasil disalin ke clipboard!') => {
    if (!toastNotice) return;
    if (toastText) toastText.textContent = message;

    toastNotice.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  };

  // -------------------------------------------------------------------------
  // 6. Copy to Clipboard
  // -------------------------------------------------------------------------
  const copyPill = document.getElementById('copy-email-pill');
  copyPill?.addEventListener('click', () => {
    const email = 'reksihendrapratama637@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email ' + email + ' berhasil disalin!');
    }).catch(() => {
      // Fallback
      showToast('Email: ' + email);
    });
  });

  // -------------------------------------------------------------------------
  // 7. Filter Tabs for Portfolio Projects
  // -------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal || cardCat === 'all') {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 8. Animated Number Counters
  // -------------------------------------------------------------------------
  // Hero currently uses an animated counter for GPA only.
  const counterElements = document.querySelectorAll('.hero-metrics-grid [data-counter]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;

    counterElements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const isDecimal = el.getAttribute('data-decimal') === 'true';
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 1600;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = progress === 1 ? target : (target * easeOut);

        if (isDecimal) {
          el.textContent = prefix + currentVal.toFixed(2) + suffix;
        } else {
          el.textContent = prefix + Math.floor(currentVal) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          if (isDecimal) {
            el.textContent = prefix + target.toFixed(2) + suffix;
          } else {
            el.textContent = prefix + target + suffix;
          }
        }
      };

      requestAnimationFrame(updateCount);
    });

    countersAnimated = true;
  };

  // Trigger counters with IntersectionObserver
  const metricsSection = document.querySelector('.hero-metrics-grid');
  if (metricsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(metricsSection);
  } else {
    animateCounters();
  }

  // -------------------------------------------------------------------------
  // 9. Case Study Modal Data & Handlers
  // -------------------------------------------------------------------------
  const caseStudiesData = {
    'vision': {
      title: 'Sistem Deteksi Cacat & Inspeksi Visual Real-Time',
      category: 'Computer Vision & Pembelajaran Mendalam',
      badge: 'YOLOv11 + CBAM Attention',
      image: 'assets/images/project-vision.jpg',
      overview: 'Solusi computer vision pada perangkat edge yang dirancang untuk mendeteksi anomali manufaktur dan mengklasifikasikan cacat fisik secara otomatis dengan presisi tinggi dan latensi rendah.',
      challenge: 'Model deteksi standar kerap mengalami penurunan akurasi pada kondisi pencahayaan dinamis dan saat mendeteksi cacat mikro berukuran kecil. Latensi inferensi juga menjadi tantangan untuk penggunaan webcam pada produksi industri.',
      solution: 'Memodifikasi arsitektur Ultralytics YOLOv11 dengan menyisipkan modul Convolutional Block Attention Module (CBAM) pada blok C3k2 residual backbone. Mengoptimalkan bobot FP16 dan kuantisasi TensorRT.',
      metrics: [
        { label: 'mAP@50 Presisi', value: '98.2%' },
        { label: 'Latensi Inferensi', value: '54ms (Edge)' },
        { label: 'Kecepatan Stream', value: '30+ FPS' },
        { label: 'Dataset Dilatih', value: '4,500+ Gambar' }
      ],
      techStack: ['Python', 'PyTorch', 'YOLOv11', 'CBAM', 'FastAPI', 'OpenCV', 'Docker']
    },
    'mlops': {
      title: 'Platform Analisis Fitur & Diagnostik ML (XAI)',
      category: 'Machine Learning Full-Stack & MLOps',
      badge: 'FastAPI + React + SHAP',
      image: 'assets/images/project-mlops.jpg',
      overview: 'Aplikasi analitik prediktif full-stack untuk tim teknis dengan visualisasi Explainable AI (XAI), pengaturan parameter dinamis, dan pembuatan laporan PDF otomatis.',
      challenge: 'Model machine learning sering dianggap sebagai "kotak hitam" (black box), sehingga pengambil keputusan kesulitan memvalidasi rekomendasi berdasarkan data.',
      solution: 'Membangun antarmuka dashboard reaktif terintegrasi REST API FastAPI dengan komputasi visual SHAP (SHapley Additive exPlanations) secara real-time.',
      metrics: [
        { label: 'Waktu Respon API', value: '< 120ms' },
        { label: 'Akurasi Model F1', value: '94.8%' },
        { label: 'Ekspor Laporan', value: 'Otomatis PDF' },
        { label: 'Containerization', value: 'Dockerized' }
      ],
      techStack: ['React', 'FastAPI', 'Scikit-Learn', 'SHAP', 'Tailwind', 'Docker']
    },
    'edge': {
      title: 'Edge Vision Telemetry & Model Benchmarking',
      category: 'Komputasi Tertanam & Edge Computing',
      badge: 'ONNX + TensorRT Engine',
      image: 'assets/images/project-vision.jpg',
      overview: 'Sistem pengujian performa untuk membandingkan kecepatan komputasi, penggunaan VRAM, dan akurasi inferensi antara model DenseNet201 dan varian YOLOv11.',
      challenge: 'Keterbatasan daya komputasi perangkat edge menuntut kompromi yang ketat antara throughput FPS dan akurasi deteksi spasial.',
      solution: 'Mengembangkan harness benchmarking otomatis yang mencatat latensi per frame, konsumsi memori, dan F1 score secara real-time.',
      metrics: [
        { label: 'Throughput', value: '62 FPS' },
        { label: 'Efisiensi Memori', value: '-38% VRAM' },
        { label: 'Format Model', value: 'ONNX / TRT' },
        { label: 'Baseline Uji', value: 'DenseNet201' }
      ],
      techStack: ['Python', 'ONNX Runtime', 'TensorRT', 'PyTorch', 'Linux']
    }
  };

  const openCaseStudyModal = (studyKey) => {
    const data = caseStudiesData[studyKey];
    if (!data || !caseStudyModal) return;

    document.getElementById('cs-modal-category').textContent = data.category;
    document.getElementById('cs-modal-title').textContent = data.title;
    document.getElementById('cs-modal-badge').textContent = data.badge;
    document.getElementById('cs-modal-overview').textContent = data.overview;
    document.getElementById('cs-modal-challenge').textContent = data.challenge;
    document.getElementById('cs-modal-solution').textContent = data.solution;
    
    const imgEl = document.getElementById('cs-modal-img');
    if (imgEl) imgEl.src = data.image;

    // Render Metrics
    const metricsGrid = document.getElementById('cs-modal-metrics');
    if (metricsGrid) {
      metricsGrid.innerHTML = data.metrics.map(m => `
        <div class="metric-card" style="padding: 0.85rem;">
          <span style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 700; color: var(--primary);">${m.value}</span>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--on-surface-variant); text-transform: uppercase; margin-top: 0.2rem;">${m.label}</span>
        </div>
      `).join('');
    }

    // Render Tech Stack
    const techBox = document.getElementById('cs-modal-tech');
    if (techBox) {
      techBox.innerHTML = data.techStack.map(t => `
        <span class="skill-chip-dark" style="font-size: 0.75rem; padding: 0.35rem 0.85rem;">${t}</span>
      `).join('');
    }

    caseStudyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  // Bind click to case study buttons
  document.querySelectorAll('[data-case-study]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const studyKey = btn.getAttribute('data-case-study');
      openCaseStudyModal(studyKey);
    });
  });

  // -------------------------------------------------------------------------
  // 10. Document / Credential Verification Modal
  // -------------------------------------------------------------------------
  const credentialData = {
    'asdos': {
      title: 'Surat Keputusan Asisten Dosen Laboratorium',
      org: 'Universitas Bengkulu • Jurusan Informatika',
      id: 'SK-ASDOS-INF-2023/2024',
      date: 'Tahun Akademik 2023 - 2024',
      status: 'Terverifikasi Resmi',
      desc: 'Membimbing praktikum pemrograman web, algoritma dan komputasi sains untuk 80+ mahasiswa sarjana informatika. Bertanggung jawab atas bimbingan materi FastAPI, database, dan review kode proyek.'
    },
    'sinta': {
      title: 'Publikasi Riset Jurnal Terakreditasi SINTA 3',
      org: 'Jurnal Ilmiah Rekayasa Informatika Nasional',
      id: 'DOI: 10.31294/jri.v12i2.8841',
      date: 'Tahun Publikasi 2024',
      status: 'Peer-Reviewed SINTA 3',
      desc: 'Manuskrip ilmiah berjudul "Integrasi Convolutional Block Attention Module (CBAM) pada Arsitektur YOLOv11 untuk Deteksi Cacat Spasial Presisi Tinggi". Mencapai metrik mAP@50 sebesar 98.2%.'
    },
    'hacktiv8': {
      title: 'Peringkasan & Klasifikasi Data Terverifikasi',
      org: 'Hacktiv8 • IBM Ecosystem Collaboration',
      id: 'HCK-IBM-2025-REKSI-082',
      date: 'Februari 2025',
      status: 'Sertifikasi Kompetensi Industri',
      desc: 'Validasi keahlian pemrosesan bahasa alami (NLP), pipeline klasifikasi data terstruktur, teknik reduksi dimensi, dan evaluasi matriks konfusi berbasis ekosistem machine learning IBM.'
    },
    'dicoding': {
      title: 'Arsitektur Sistem MLOps & ML Pipeline',
      org: 'Dicoding Indonesia • Tech Academy',
      id: 'DCD-MLOPS-2025-9923-RHP',
      date: 'Januari 2025',
      status: 'Sertifikasi Keahlian Terverifikasi',
      desc: 'Kurikulum mendalam mencakup model registry dengan MLflow, pengujian otomatis pipeline inferensi, containerization microservices dengan Docker, dan Continuous Deployment model machine learning.'
    },
    'degree': {
      title: 'Ijazah Sarjana Komputer (S.Kom) - Cum Laude',
      org: 'Universitas Bengkulu • Fakultas Teknik',
      id: 'IPK: 3.84 / 4.00 (Dengan Pujian)',
      date: 'Lulusan 2025',
      status: 'Akreditasi Unggul',
      desc: 'Menyelesaikan kurikulum sarjana informatika dengan fokus rekayasa perangkat lunak dan kecerdasan buatan. Meraih predikat kelulusan Cum Laude dengan rekam jejak riset Computer Vision terapan.'
    }
  };

  const openVerifyModal = (credKey) => {
    const cred = credentialData[credKey];
    if (!cred || !verifyModal) return;

    document.getElementById('verify-title').textContent = cred.title;
    document.getElementById('verify-org').textContent = cred.org;
    document.getElementById('verify-id').textContent = cred.id;
    document.getElementById('verify-date').textContent = cred.date;
    document.getElementById('verify-status').textContent = cred.status;
    document.getElementById('verify-desc').textContent = cred.desc;

    verifyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('[data-verify]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const credKey = btn.getAttribute('data-verify');
      openVerifyModal(credKey);
    });
  });

  // -------------------------------------------------------------------------
  // 11. CV Preview Modal Handlers
  // -------------------------------------------------------------------------
  const openCvModalBtn = document.querySelectorAll('[data-open-cv]');
  openCvModalBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cvModal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // -------------------------------------------------------------------------
  // 12. Modal Close Listeners (Generic)
  // -------------------------------------------------------------------------
  const allModals = document.querySelectorAll('.modal-overlay');

  const closeModal = (modal) => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  allModals.forEach((modal) => {
    // Close button
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn?.addEventListener('click', () => closeModal(modal));

    // Backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // ESC key to close any modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach((m) => {
        if (m.classList.contains('open')) closeModal(m);
      });
      closeMobileMenu();
    }
  });

  // -------------------------------------------------------------------------
  // 13. Interactive Contact Form Handler
  // -------------------------------------------------------------------------
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();
      const message = document.getElementById('form-message')?.value.trim();
      const submitBtn = document.getElementById('form-submit-btn');

      if (!name || !email || !message) {
        alert('Mohon lengkapi formulir sebelum mengirim pesan.');
        return;
      }

      // Simulate loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="pulse-beacon" style="background: white;"></span>
          <span>Mengirim Pesan...</span>
        `;
      }

      setTimeout(() => {
        if (formFeedback) {
          formFeedback.classList.add('success');
          formFeedback.innerHTML = `
            <strong>Terima kasih, ${name}!</strong> Pesan Anda telah terkirim. Reksi akan merespon melalui email (${email}) dalam waktu kurang dari 24 jam kerja.
          `;
        }

        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Pesan Terkirim</span>
            <span class="material-symbols-outlined text-[18px]">done_all</span>
          `;
        }

        showToast('Pesan berhasil dikirim ke inbox Reksi!');
      }, 900);
    });
  }

  // Smooth hash link scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
