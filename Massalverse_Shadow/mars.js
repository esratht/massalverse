// MARS VURUCU SÖZLEŞMESİ KODU (LOCAL STORAGE)

const TOTAL_DAYS = 7;
const CONTRACT_KEY = 'marsContract';

/**
 * Kullanıcı verilerini LocalStorage'dan çeker. Yoksa yeni sözleşme başlatır.
 */
function getContractStatus() {
    const stored = localStorage.getItem(CONTRACT_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Yeni sözleşme başlat
    return {
        day: 1, // Gün 1'den başla
        lastAction: new Date(0).toISOString().split('T')[0], // Geçmiş bir tarih
        unitCount: 0 // Başlangıçta eylem birimi sıfır
    };
}

/**
 * Sözleşme durumunu kaydeder.
 */
function saveContractStatus(status) {
    localStorage.setItem(CONTRACT_KEY, JSON.stringify(status));
}

/**
 * Bugünün eyleminin yapılıp yapılmadığını kontrol eder ve Eylem Birimi verir.
 */
function performMarsAction() {
    let status = getContractStatus();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 1. GÜN KONTROLÜ
    if (status.lastAction === today) {
        return { 
            message: `HATA: ${status.day - 1}. Gün eylemi bugün zaten yapıldı. Birim: ${status.unitCount}`, 
            status: 'error',
            units: status.unitCount
        };
    }

    // 2. YENİ GÜN VE SÖZLEŞME İLERLEMESİ
    if (status.day <= TOTAL_DAYS) {
        status.unitCount++;
        status.lastAction = today;
        status.day++;
        
        saveContractStatus(status);

        if (status.day > TOTAL_DAYS) {
            return { 
                message: `SÖZLEŞME TAMAMLANDI! ${TOTAL_DAYS} Eylem Birimi kazanıldı.`, 
                status: 'complete',
                units: status.unitCount
            };
        } else {
            return { 
                message: `${status.day - 1}. Gün eylemi kaydedildi. Eylem Birimi kazanıldı.`, 
                status: 'success',
                units: status.unitCount
            };
        }
    } else {
        return { 
            message: `SÖZLEŞME ZATEN BİTTİ. Yeni sözleşme başlatılmalı.`, 
            status: 'complete',
            units: status.unitCount
        };
    }
}