// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.5;

    // Rastgele pozisyon ve animasyon ataması için fonksiyon
    function initializeFloatingImages() {
        const floatingImages = document.querySelectorAll('.float-img');
        const animations = ['float1', 'float2', 'float3', 'float4'];
        
        // Ekranı bölgelere ayır
        const areas = [];
        const areaSize = 20; // Her bölge %20'lik alan
        
        // Tüm olası bölgeleri oluştur
        for (let top = 0; top <= 100 - areaSize; top += areaSize) {
            for (let left = 0; left <= 100 - areaSize; left += areaSize) {
                areas.push({
                    top: top + (Math.random() * (areaSize/2)),
                    left: left + (Math.random() * (areaSize/2))
                });
            }
        }

        // Bölgeleri karıştır
        for (let i = areas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [areas[i], areas[j]] = [areas[j], areas[i]];
        }

        // Her fotoğraf için kullanılmış pozisyonları takip et
        const usedPositions = new Set();

        // Her fotoğraf için yeni pozisyon bul
        floatingImages.forEach((img, index) => {
            // Rastgele animasyon ve süre seç
            const animation = animations[Math.floor(Math.random() * animations.length)];
            const duration = 15 + Math.random() * 10; // 15-25s arası
            
            // Benzersiz pozisyon bul
            let position;
            let attempts = 0;
            const maxAttempts = 50;

            do {
                // Rastgele bir bölge seç
                const areaIndex = Math.floor(Math.random() * areas.length);
                const baseArea = areas[areaIndex];
                
                // Bölge içinde rastgele bir nokta
                position = {
                    top: baseArea.top + (Math.random() * areaSize),
                    left: baseArea.left + (Math.random() * areaSize)
                };

                // Pozisyonu benzersiz bir string olarak temsil et
                const posKey = `${Math.round(position.top)},${Math.round(position.left)}`;
                
                // Eğer pozisyon kullanılmamışsa veya çok fazla deneme yapıldıysa kabul et
                if (!usedPositions.has(posKey) || attempts >= maxAttempts) {
                    usedPositions.add(posKey);
                    break;
                }

                attempts++;
            } while (attempts < maxAttempts);

            // Minimum mesafe kontrolü ekle
            const minDistance = 15; // Minimum %15 mesafe
            let tooClose = false;
            
            floatingImages.forEach((otherImg, otherIndex) => {
                if (index !== otherIndex && otherImg.style.top && otherImg.style.left) {
                    const otherTop = parseFloat(otherImg.style.top);
                    const otherLeft = parseFloat(otherImg.style.left);
                    
                    const distance = Math.sqrt(
                        Math.pow(position.top - otherTop, 2) + 
                        Math.pow(position.left - otherLeft, 2)
                    );
                    
                    if (distance < minDistance) {
                        tooClose = true;
                    }
                }
            });

            // Eğer çok yakınsa pozisyonu biraz kaydır
            if (tooClose) {
                position.top = Math.max(0, Math.min(100, position.top + (Math.random() * 20 - 10)));
                position.left = Math.max(0, Math.min(100, position.left + (Math.random() * 20 - 10)));
            }
            
            // Stilleri uygula
            img.style.animation = `${animation} ${duration}s infinite`;
            img.style.top = `${position.top}%`;
            img.style.left = `${position.left}%`;
            img.style.zIndex = 1000 + Math.floor(Math.random() * 10);
        });
    }

    // Başlangıçta çalıştır
    initializeFloatingImages();
    
    // Periyodik yenileme için değişken
    let updateInterval;
    
    // Yenileme fonksiyonu
    function startRandomUpdates() {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        
        // Her 20-40 saniye arasında rastgele bir sürede yenile
        const updateTime = 20000 + Math.random() * 20000;
        updateInterval = setInterval(initializeFloatingImages, updateTime);
    }
    
    // Başlangıçta yenileme döngüsünü başlat
    startRandomUpdates();

    // Müziği başlatma fonksiyonu
    const playMusic = () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                document.body.style.animation = 'gradientBG 15s ease infinite';
            }).catch(() => {
                // Hata durumunda sessizce devam et
            });
        }
    };

    // Tıklama olayını dinle
    document.addEventListener('click', playMusic);

    // Kalp animasyonunu müzikle senkronize et
    const heart = document.querySelector('.heart');
    heart.addEventListener('click', (e) => {
        e.stopPropagation(); // Çift tıklama önlemi
        playMusic();
        heart.style.animation = 'heartbeat 0.8s ease-in-out infinite';
    });

    // Slider kodu
    const slides = document.querySelector('.slides');
    let currentSlide = 0;
    const totalSlides = 9;
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
    
    function updateSlider() {
        slides.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
    }
    
    // Her 3 saniyede bir fotoğraf değiştir
    setInterval(nextSlide, 3000);
    
    // Dokunmatik ekran desteği
    let touchStartX = 0;
    let touchEndX = 0;
    
    slides.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    slides.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                // Sola kaydırma
                currentSlide = (currentSlide + 1) % totalSlides;
            } else {
                // Sağa kaydırma
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }
            updateSlider();
        }
    }

    // Affetme butonları işlevselliği
    const affettimBtn = document.getElementById('affettim');
    const affetmedimBtn = document.getElementById('affetmedim');
    let affetmedimClickCount = 0;

    affetmedimBtn.addEventListener('click', () => {
        affetmedimClickCount++;
        
        // Her tıklamada affetmedim butonu biraz daha küçülsün ve soluklaşsın
        const scale = Math.max(0.2, 1 - (affetmedimClickCount * 0.2));
        affetmedimBtn.style.transform = `scale(${scale})`;
        affetmedimBtn.style.opacity = scale;
        
        // Affettim butonu büyüsün ve parlasın
        affettimBtn.classList.add('growing');
        const growScale = 1 + (affetmedimClickCount * 0.2);
        affettimBtn.style.transform = `scale(${growScale})`;
        affettimBtn.style.boxShadow = `0 0 ${20 + affetmedimClickCount * 10}px #ff4757`;
        
        // 5 tıklamadan sonra affetmedim butonu kaybolsun
        if (affetmedimClickCount >= 5) {
            setTimeout(() => {
                affetmedimBtn.style.display = 'none';
            }, 500);
            
            // Affettim butonu maksimum boyuta gelsin
            affettimBtn.style.transform = 'scale(2)';
            affettimBtn.style.boxShadow = '0 0 50px #ff4757';
        }
    });

    affettimBtn.addEventListener('click', () => {
        // Affetmedim butonunu gizle
        affetmedimBtn.classList.add('hidden');
        setTimeout(() => {
            affetmedimBtn.style.display = 'none';
        }, 500);

        // Affettim butonunu büyüt ve parıldat
        affettimBtn.classList.add('growing');
        affettimBtn.style.boxShadow = '0 0 30px #ff4757';
        
        // Kalp animasyonunu hızlandır
        document.querySelector('.heart').style.animation = 'heartbeat 0.8s ease-in-out infinite';
    });
}); 