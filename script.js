document.addEventListener('DOMContentLoaded', function() {
    // Sembunyikan loading screen setelah 2 detik
    setTimeout(function() {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 2000);

    // Toggle menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Animasi hamburger icon
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });

    // Theme switchers
    const lightModeBtn = document.getElementById('light-mode-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const goldModeBtn = document.getElementById('gold-mode-btn');
    
    lightModeBtn.addEventListener('click', function() {
        document.body.classList.remove('dark-mode', 'gold-mode');
    });
    
    darkModeBtn.addEventListener('click', function() {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('gold-mode');
    });
    
    goldModeBtn.addEventListener('click', function() {
        document.body.classList.add('gold-mode');
        document.body.classList.remove('dark-mode');
    });

    // Swipe detection untuk tombol khusus
    const swipeBtn = document.getElementById('swipe-btn');
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Jika usapan cukup panjang (minimal 100px)
        if (Math.abs(diffX) > 100 || Math.abs(diffY) > 100) {
            // Tampilkan tombol di posisi akhir usapan
            swipeBtn.style.left = (touchEndX - 30) + 'px';
            swipeBtn.style.top = (touchEndY - 30) + 'px';
            swipeBtn.classList.add('visible');
            
            // Sembunyikan tombol setelah 3 detik
            setTimeout(function() {
                swipeBtn.classList.remove('visible');
            }, 3000);
        }
    }
    
    // Fungsi khusus ketika tombol swipe diklik
    swipeBtn.addEventListener('click', function() {
        alert('🎉 Fitur Khusus diaktifkan! Terima kasih telah mengusap layar.');
        swipeBtn.classList.remove('visible');
    });

    // Smooth scrolling untuk anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Tutup menu mobile jika terbuka
                nav.classList.remove('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Kode untuk form kontak
    const contactForm = document.getElementById('contactForm');
    const notification = document.getElementById('notification');
    const methodOptions = document.querySelectorAll('.method-option');
    
    // Ganti dengan nomor WhatsApp Anda
    const whatsappNumber = '6281244046308'; 
    
    // Atur event listener untuk opsi metode
    methodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Hapus kelas active dari semua opsi
            methodOptions.forEach(opt => {
                opt.classList.remove('active');
                const radio = opt.querySelector('.method-radio');
                radio.checked = false;
            });
            
            // Tambahkan kelas active ke opsi yang diklik
            this.classList.add('active');
            
            // Update radio button
            const radio = this.querySelector('.method-radio');
            radio.checked = true;
        });
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const selectedMethod = document.querySelector('input[name="method"]:checked');
        
        // Validasi jika metode belum dipilih
        if (!selectedMethod) {
            showNotification('Silakan pilih metode pengiriman!', 'error');
            return;
        }
        
        const method = selectedMethod.value;
        
        // Validasi
        if (!name || !email || !message) {
            showNotification('Harap isi semua field!', 'error');
            return;
        }
        
        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Format email tidak valid!', 'error');
            return;
        }
        
        if (method === 'whatsapp') {
            const whatsappMessage = `Halo, saya ${name} (${email}). Pesan: ${message}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
            showNotification('Pesan berhasil dikirim! Silakan lanjutkan percakapan di WhatsApp.', 'success');
            
            // Reset form setelah pengiriman
            contactForm.reset();
        } else if (method === 'email') {
            // Ubah form untuk dikirim melalui FormSubmit (tanpa AJAX)
            contactForm.setAttribute('action', 'https://formsubmit.co/piereladasi896@gmail.com');
            contactForm.setAttribute('method', 'POST');
            
            // Tambahkan input hidden untuk konfigurasi FormSubmit
            addHiddenInput(contactForm, '_subject', `Pesan dari ${name} - Website Contact Form`);
            addHiddenInput(contactForm, '_template', 'table');
            addHiddenInput(contactForm, '_captcha', 'false');
            addHiddenInput(contactForm, '_next', window.location.href + '?success=true');
            
            // Kirim form secara langsung
            contactForm.submit();
            
            // Tampilkan notifikasi
            showNotification('Mengirim pesan melalui email...', 'loading');
        }
    });
    
    // Fungsi untuk menambahkan input hidden ke form
    function addHiddenInput(form, name, value) {
        let input = form.querySelector(`input[name="${name}"]`);
        if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            form.appendChild(input);
        }
        input.value = value;
    }
    
    // Cek jika ada parameter success di URL (setelah pengiriman form)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
        showNotification('Pesan berhasil dikirim melalui email! Kami akan membalasnya segera.', 'success');
        
        // Hapus parameter dari URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Reset form
        contactForm.reset();
    }
    
    function showNotification(text, type) {
        if (!notification) {
            console.log('Notification element not found');
            return;
        }
        
        notification.textContent = text;
        notification.className = 'notification ' + type;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
});