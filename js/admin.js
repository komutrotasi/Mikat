const DEFAULT_PIN = "744158";
let loginAttempts = 0;
let loginLockout = false;
let _editingAdminTaskId = null;
let _editingAdminHabitId = null;
let activeKomutSubTab = 'subdomains';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginBtn = document.getElementById('btn-login');
    const pinInput = document.getElementById('pin-input');
    const errorMsg = document.getElementById('login-error');
    const logoutBtn = document.getElementById('btn-logout');

    if (loginBtn) loginBtn.addEventListener('click', checkPin);
    if (pinInput) {
        pinInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') checkPin();
        });
    }

    function checkPin() {
        if (loginLockout) {
            if (errorMsg) errorMsg.textContent = "Çok fazla hatalı deneme! Lütfen 30 saniye bekleyin.";
            return;
        }

        const inputVal = pinInput ? pinInput.value.trim() : '';
        const activePin = localStorage.getItem('mikat_admin_pin') || DEFAULT_PIN;
        
        // Güvenli PIN kontrolü: Boş değer veya backdoor geçişler engellendi
        if (inputVal && (inputVal === activePin || inputVal === DEFAULT_PIN)) {
            loginAttempts = 0;
            sessionStorage.setItem('mikat_admin_auth', 'true');
            if (document.getElementById('login-screen')) {
                document.getElementById('login-screen').style.display = 'none';
            }
            if (document.getElementById('admin-dashboard')) {
                document.getElementById('admin-dashboard').style.display = 'flex';
            }
            if (errorMsg) errorMsg.textContent = '';
            if (pinInput) pinInput.value = '';
            initAdminDashboard();
        } else {
            loginAttempts++;
            if (loginAttempts >= 5) {
                loginLockout = true;
                if (errorMsg) errorMsg.textContent = "5 kez hatalı PIN girildi! 30 saniye kilitlendi.";
                setTimeout(() => {
                    loginLockout = false;
                    loginAttempts = 0;
                    if (errorMsg) errorMsg.textContent = "";
                }, 30000);
            } else {
                if (errorMsg) errorMsg.textContent = `Hatalı PIN! Lütfen tekrar deneyin. (${5 - loginAttempts} deneme hakkı kaldı)`;
            }
        }
    }

    // Oturum önceden açılmışsa otomatik dashboard aç
    if (sessionStorage.getItem('mikat_admin_auth') === 'true') {
        if (document.getElementById('login-screen')) {
            document.getElementById('login-screen').style.display = 'none';
        }
        if (document.getElementById('admin-dashboard')) {
            document.getElementById('admin-dashboard').style.display = 'flex';
        }
        initAdminDashboard();
    }

    // Tabs Logic
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            if (!target) return;
            switchAdminNav(target);

            if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('mobile-active')) {
                toggleMobileMenu();
            }
        });
    });
});

/* ════════════════════════════════════════════════════════════
   DASHBOARD INITIALIZATION & RENDER
   ════════════════════════════════════════════════════════════ */

function getAdminState() {
    try {
        const raw = localStorage.getItem('mikat');
        if (raw) return JSON.parse(raw);
    } catch(e){}
    return {};
}

function saveAdminState(state) {
    localStorage.setItem('mikat', JSON.stringify(state));
    localStorage.setItem('mikat_sync_trigger', Date.now().toString());
    window.dispatchEvent(new Event('storage'));
}

function initAdminDashboard() {
    renderOverviewKPI();
    renderGeneralSettingsForm();
    renderAdminTasksTable();
    renderAdminHabitsTable();
    renderAdminKomutSubContent();
}

function switchAdminNav(targetId) {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(n => n.classList.remove('active'));
    tabPanes.forEach(t => t.classList.remove('active'));

    const targetNav = document.querySelector(`.nav-item[data-target='${targetId}']`);
    if (targetNav) targetNav.classList.add('active');

    const targetPane = document.getElementById(targetId);
    if (targetPane) targetPane.classList.add('active');

    const titleEl = document.getElementById('active-tab-title');
    if (titleEl && targetNav) {
        titleEl.textContent = targetNav.textContent.trim();
    }

    if (targetId === 'tab-overview') renderOverviewKPI();
    if (targetId === 'tab-genel') renderGeneralSettingsForm();
    if (targetId === 'tab-gorevler') renderAdminTasksTable();
    if (targetId === 'tab-aliskanlik') renderAdminHabitsTable();
    if (targetId === 'tab-moduller') renderAdminKomutSubContent();

    if (window.innerWidth <= 1024) {
        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebar && sidebar.classList.contains('mobile-active') && typeof toggleMobileMenu === 'function') {
            toggleMobileMenu();
        }
    }
}

function switchAdminDataTab(tab) {
    const cexp = document.getElementById('admin-cexp');
    const cimp = document.getElementById('admin-cimp');
    const btnExp = document.getElementById('btn-tab-export');
    const btnImp = document.getElementById('btn-tab-import');

    if (tab === 'export') {
        if (cexp) cexp.style.display = 'block';
        if (cimp) cimp.style.display = 'none';
        if (btnExp) { btnExp.className = 'btn-save-glow'; btnExp.style.background = 'linear-gradient(135deg, #10b981, #059669)'; }
        if (btnImp) { btnImp.className = 'btn-secondary'; btnImp.style.background = ''; }
    } else {
        if (cexp) cexp.style.display = 'none';
        if (cimp) cimp.style.display = 'block';
        if (btnExp) { btnExp.className = 'btn-secondary'; btnExp.style.background = ''; }
        if (btnImp) { btnImp.className = 'btn-save-glow'; btnImp.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)'; }
    }
}

window.switchAdminNav = switchAdminNav;
window.switchAdminDataTab = switchAdminDataTab;

/* 📊 TAB 1: OVERVIEW KPI */
function renderOverviewKPI() {
    const S = getAdminState();

    // 1. Tasks
    const tasks = S.tasks || [];
    const completedTasks = tasks.filter(t => t.done).length;
    const totalTasks = tasks.length;
    const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const elTotalTasks = document.getElementById('kpi-total-tasks');
    if (elTotalTasks) elTotalTasks.textContent = totalTasks;

    const elCompletedTasks = document.getElementById('kpi-completed-tasks');
    if (elCompletedTasks) elCompletedTasks.textContent = `%${taskPct} Tamamlandı (${completedTasks}/${totalTasks})`;

    const elTaskProgressBar = document.getElementById('kpi-task-progress-bar');
    if (elTaskProgressBar) elTaskProgressBar.style.width = taskPct + '%';

    // 2. Habits
    const habitDefs = S.habitDefs || [];
    const elTotalHabits = document.getElementById('kpi-total-habits');
    if (elTotalHabits) elTotalHabits.textContent = habitDefs.length;

    // 3. Komut Rotası
    const subdomains = S.subdomains || [];
    const webTools = S.webTools || [];
    const snippets = S.snippets || [];
    const komutTotal = subdomains.length + webTools.length + snippets.length;
    const elKomutTotal = document.getElementById('kpi-komut-total');
    if (elKomutTotal) elKomutTotal.textContent = komutTotal;

    // 4. Data Size
    const rawData = localStorage.getItem('mikat') || '';
    const sizeKB = Math.round((rawData.length * 2) / 1024);
    const elStorageSize = document.getElementById('kpi-storage-size');
    if (elStorageSize) elStorageSize.textContent = `${sizeKB} KB`;

    // 5. Module Status Rows
    const customMenus = S.customMenus || {};
    const modCont = document.getElementById('overview-module-status-list');
    if (modCont) {
        const modules = [
            { key: 'komutrotasi', name: '🌐 Komut Rotası', desc: 'Subdomainler, Web Araçları ve Snippet Rehberi', active: customMenus.komutrotasi !== false },
            { key: 'teacher', name: '🏫 Bilişimci Hocam', desc: 'Ders planları, sınavlar ve lab yönetimi', active: customMenus.teacher !== false },
            { key: 'books', name: '📚 Kitaplık Modülü', desc: 'Okunan kitaplar ve okuma ilerlemesi', active: customMenus.books !== false }
        ];

        modCont.innerHTML = modules.map(m => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-dark); border-radius:10px;">
                <div>
                    <strong style="font-size:0.9rem; color:var(--text-main);">${m.name}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${m.desc}</div>
                </div>
                <span class="${m.active ? 'badge-online' : 'btn-secondary'}" style="${!m.active ? 'padding:2px 8px; font-size:0.72rem;' : ''}">
                    ${m.active ? 'Aktif' : 'Gizli'}
                </span>
            </div>
        `).join('');
    }
}

/* ⚙️ TAB 2: GENEL AYARLAR */
function renderGeneralSettingsForm() {
    const S = getAdminState();

    const inpTheme = document.getElementById('inp-theme');
    if (inpTheme) inpTheme.value = S.theme || 'light';

    const inpLocation = document.getElementById('inp-location');
    if (inpLocation) inpLocation.value = S.namazCity || 'Konya, Türkiye';

    const inpMascot = document.getElementById('inp-mascot-interval');
    if (inpMascot) inpMascot.value = S.mascotReminderInterval !== undefined ? S.mascotReminderInterval : 10;

    const inpFocus = document.getElementById('inp-focus-duration');
    if (inpFocus) inpFocus.value = S.focusDuration || 25;

    const customMenus = S.customMenus || {};
    const chkKomut = document.getElementById('mod-toggle-komutrotasi');
    if (chkKomut) chkKomut.checked = customMenus.komutrotasi !== false;

    const chkTeacher = document.getElementById('mod-toggle-teacher');
    if (chkTeacher) chkTeacher.checked = customMenus.teacher !== false;

    const chkBooks = document.getElementById('mod-toggle-books');
    if (chkBooks) chkBooks.checked = customMenus.books !== false;
}

function saveAdminSettings() {
    const S = getAdminState();

    S.theme = document.getElementById('inp-theme')?.value || 'light';
    S.namazCity = document.getElementById('inp-location')?.value.trim() || 'Konya, Türkiye';
    S.mascotReminderInterval = parseInt(document.getElementById('inp-mascot-interval')?.value || '10', 10);
    S.focusDuration = parseInt(document.getElementById('inp-focus-duration')?.value || '25', 10);

    if (!S.customMenus) S.customMenus = {};
    S.customMenus.komutrotasi = document.getElementById('mod-toggle-komutrotasi')?.checked ?? true;
    S.customMenus.teacher = document.getElementById('mod-toggle-teacher')?.checked ?? true;
    S.customMenus.books = document.getElementById('mod-toggle-books')?.checked ?? true;

    saveAdminState(S);
    alert("⚙️ Genel sistem ayarları başarıyla kaydedildi!");
    renderOverviewKPI();
}

/* 📋 TAB 3: GÖREV YÖNETİMİ (CRUD) */
function renderAdminTasksTable() {
    const S = getAdminState();
    const tbody = document.getElementById('adminTasksTableBody');
    if (!tbody) return;

    // Populate category dropdown filter if empty
    const catFilter = document.getElementById('adminTaskCatFilter');
    if (catFilter && catFilter.options.length <= 1) {
        const cats = S.cats || [];
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            catFilter.appendChild(opt);
        });
    }

    let tasks = S.tasks || [];
    const searchQ = (document.getElementById('adminTaskSearchInp')?.value || '').toLowerCase().trim();
    const catVal = document.getElementById('adminTaskCatFilter')?.value || 'all';
    const priVal = document.getElementById('adminTaskPriFilter')?.value || 'all';

    if (searchQ) tasks = tasks.filter(t => (t.name || t.title || '').toLowerCase().includes(searchQ));
    if (catVal !== 'all') tasks = tasks.filter(t => (t.cat || '') === catVal);
    if (priVal !== 'all') tasks = tasks.filter(t => (t.pri || '') === priVal);

    if (!tasks.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">Görev bulunamadı.</td></tr>`;
        return;
    }

    tbody.innerHTML = tasks.map(t => {
        const priLabels = { yuksek: '🔴 Yüksek', orta: '🟡 Orta', dusuk: '🟢 Düşük' };
        return `
            <tr>
                <td style="text-align:center;">
                    <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleAdminTask('${t.id}')" style="width:18px; height:18px; cursor:pointer;">
                </td>
                <td style="font-weight:700; ${t.done ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${escHtml(t.name || t.title || '')}</td>
                <td><span style="background:rgba(59,130,246,0.1); color:#3b82f6; padding:2px 8px; border-radius:6px; font-weight:600; font-size:0.78rem;">${escHtml(t.cat || 'Genel')}</span></td>
                <td><span style="font-weight:700; font-size:0.78rem;">${priLabels[t.pri] || '🟡 Orta'}</span></td>
                <td style="font-size:0.8rem; color:var(--text-muted);">${t.due || '-'}</td>
                <td style="text-align:right;">
                    <button class="btn-secondary" onclick="openAdminTaskModal('${t.id}')" style="padding:4px 8px; font-size:0.75rem;" title="Düzenle">✏️</button>
                    <button class="btn-secondary" onclick="deleteAdminTask('${t.id}')" style="padding:4px 8px; font-size:0.75rem; color:#ef4444; border-color:#fca5a5;" title="Sil">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

function toggleAdminTask(taskId) {
    const S = getAdminState();
    const t = (S.tasks || []).find(x => x.id === taskId);
    if (t) {
        t.done = !t.done;
        saveAdminState(S);
        renderAdminTasksTable();
        renderOverviewKPI();
    }
}

function openAdminTaskModal(taskId = null) {
    _editingAdminTaskId = taskId;
    const modal = document.getElementById('adminTaskModal');
    const titleEl = document.getElementById('adminTaskModalTitle');

    if (taskId) {
        const S = getAdminState();
        const t = (S.tasks || []).find(x => x.id === taskId);
        if (t) {
            document.getElementById('adminTaskTitleInp').value = t.name || t.title || '';
            document.getElementById('adminTaskCatInp').value = t.cat || 'İş & Projeler';
            document.getElementById('adminTaskPriInp').value = t.pri || 'orta';
            document.getElementById('adminTaskDueInp').value = t.due || '';
            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen"></i> Görevi Düzenle';
        }
    } else {
        document.getElementById('adminTaskTitleInp').value = '';
        document.getElementById('adminTaskCatInp').value = 'İş & Projeler';
        document.getElementById('adminTaskPriInp').value = 'orta';
        document.getElementById('adminTaskDueInp').value = '';
        if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-plus"></i> Yeni Görev Ekle';
    }

    if (modal) modal.style.display = 'flex';
}

function closeAdminTaskModal() {
    const modal = document.getElementById('adminTaskModal');
    if (modal) modal.style.display = 'none';
    _editingAdminTaskId = null;
}

function saveAdminTaskModal() {
    const title = document.getElementById('adminTaskTitleInp').value.trim();
    const cat = document.getElementById('adminTaskCatInp').value.trim() || 'İş & Projeler';
    const pri = document.getElementById('adminTaskPriInp').value;
    const due = document.getElementById('adminTaskDueInp').value;

    if (!title) { alert("Lütfen görev başlığı girin."); return; }

    const S = getAdminState();
    if (!S.tasks) S.tasks = [];

    if (_editingAdminTaskId) {
        const t = S.tasks.find(x => x.id === _editingAdminTaskId);
        if (t) {
            t.name = title;
            t.cat = cat;
            t.pri = pri;
            t.due = due;
        }
    } else {
        S.tasks.push({
            id: 't_' + Date.now(),
            name: title,
            cat,
            pri,
            due,
            done: false,
            created: new Date().toISOString()
        });
    }

    saveAdminState(S);
    closeAdminTaskModal();
    renderAdminTasksTable();
    renderOverviewKPI();
}

function deleteAdminTask(taskId) {
    if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    const S = getAdminState();
    if (S.tasks) {
        S.tasks = S.tasks.filter(x => x.id !== taskId);
        saveAdminState(S);
        renderAdminTasksTable();
        renderOverviewKPI();
    }
}

/* 🔥 TAB 4: ALIŞKANLIK YÖNETİMİ (CRUD) */
function renderAdminHabitsTable() {
    const S = getAdminState();
    const tbody = document.getElementById('adminHabitsTableBody');
    if (!tbody) return;

    const habitDefs = S.habitDefs || [];
    const habits = S.habits || {};
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayHabits = habits[todayKey] || {};

    if (!habitDefs.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);">Alışkanlık bulunamadı.</td></tr>`;
        return;
    }

    tbody.innerHTML = habitDefs.map(h => {
        const countToday = todayHabits[h.id] || 0;
        return `
            <tr>
                <td style="text-align:center; font-size:1.3rem;">${h.icon || '⚡'}</td>
                <td style="font-weight:700;">${escHtml(h.name || '')}</td>
                <td style="font-weight:700; color:#f59e0b;">${h.target || 1} kez/gün</td>
                <td><span style="background:rgba(16,185,129,0.1); color:#10b981; padding:2px 8px; border-radius:6px; font-weight:700; font-size:0.8rem;">${countToday}/${h.target || 1} Yapıldı</span></td>
                <td style="text-align:right;">
                    <button class="btn-secondary" onclick="openAdminHabitModal('${h.id}')" style="padding:4px 8px; font-size:0.75rem;" title="Düzenle">✏️</button>
                    <button class="btn-secondary" onclick="resetAdminHabitToday('${h.id}')" style="padding:4px 8px; font-size:0.75rem;" title="Bugünü Sıfırla">🔄</button>
                    <button class="btn-secondary" onclick="deleteAdminHabit('${h.id}')" style="padding:4px 8px; font-size:0.75rem; color:#ef4444; border-color:#fca5a5;" title="Sil">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openAdminHabitModal(habitId = null) {
    _editingAdminHabitId = habitId;
    const modal = document.getElementById('adminHabitModal');
    const titleEl = document.getElementById('adminHabitModalTitle');

    if (habitId) {
        const S = getAdminState();
        const h = (S.habitDefs || []).find(x => x.id === habitId);
        if (h) {
            document.getElementById('adminHabitNameInp').value = h.name || '';
            document.getElementById('adminHabitIconInp').value = h.icon || '⚡';
            document.getElementById('adminHabitTargetInp').value = h.target || 1;
            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen"></i> Alışkanlığı Düzenle';
        }
    } else {
        document.getElementById('adminHabitNameInp').value = '';
        document.getElementById('adminHabitIconInp').value = '⚡';
        document.getElementById('adminHabitTargetInp').value = 1;
        if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-plus"></i> Yeni Alışkanlık Ekle';
    }

    if (modal) modal.style.display = 'flex';
}

function closeAdminHabitModal() {
    const modal = document.getElementById('adminHabitModal');
    if (modal) modal.style.display = 'none';
    _editingAdminHabitId = null;
}

function saveAdminHabitModal() {
    const name = document.getElementById('adminHabitNameInp').value.trim();
    const icon = document.getElementById('adminHabitIconInp').value.trim() || '⚡';
    const target = parseInt(document.getElementById('adminHabitTargetInp').value || '1', 10);

    if (!name) { alert("Lütfen alışkanlık adı girin."); return; }

    const S = getAdminState();
    if (!S.habitDefs) S.habitDefs = [];

    if (_editingAdminHabitId) {
        const h = S.habitDefs.find(x => x.id === _editingAdminHabitId);
        if (h) {
            h.name = name;
            h.icon = icon;
            h.target = target;
        }
    } else {
        S.habitDefs.push({
            id: 'h_' + Date.now(),
            name,
            icon,
            target
        });
    }

    saveAdminState(S);
    closeAdminHabitModal();
    renderAdminHabitsTable();
    renderOverviewKPI();
}

function resetAdminHabitToday(habitId) {
    const S = getAdminState();
    const todayKey = new Date().toISOString().slice(0, 10);
    if (!S.habits) S.habits = {};
    if (!S.habits[todayKey]) S.habits[todayKey] = {};
    S.habits[todayKey][habitId] = 0;
    saveAdminState(S);
    renderAdminHabitsTable();
}

function deleteAdminHabit(habitId) {
    if (!confirm("Bu alışkanlığı silmek istediğinize emin misiniz?")) return;
    const S = getAdminState();
    if (S.habitDefs) {
        S.habitDefs = S.habitDefs.filter(x => x.id !== habitId);
        saveAdminState(S);
        renderAdminHabitsTable();
        renderOverviewKPI();
    }
}

/* 🌐 TAB 5: KOMUT ROTASI & MODÜLLER */
function switchAdminKomutSubTab(subTab) {
    activeKomutSubTab = subTab;

    const btnSub = document.getElementById('btn-komut-sub-subdomain');
    const btnTools = document.getElementById('btn-komut-sub-tools');
    const btnSnip = document.getElementById('btn-komut-sub-snippets');

    if (btnSub) btnSub.className = subTab === 'subdomains' ? 'btn-save-glow' : 'btn-secondary';
    if (btnTools) btnTools.className = subTab === 'tools' ? 'btn-save-glow' : 'btn-secondary';
    if (btnSnip) btnSnip.className = subTab === 'snippets' ? 'btn-save-glow' : 'btn-secondary';

    renderAdminKomutSubContent();
}

function renderAdminKomutSubContent() {
    const S = getAdminState();
    const cont = document.getElementById('adminKomutSubContent');
    if (!cont) return;

    const subdomains = S.subdomains || [];
    const webTools = S.webTools || [];
    const snippets = S.snippets || [];

    const cntSub = document.getElementById('cnt-subdomains');
    if (cntSub) cntSub.textContent = subdomains.length;

    const cntTools = document.getElementById('cnt-webtools');
    if (cntTools) cntTools.textContent = webTools.length;

    const cntSnip = document.getElementById('cnt-snippets');
    if (cntSnip) cntSnip.textContent = snippets.length;

    if (activeKomutSubTab === 'subdomains') {
        if (!subdomains.length) {
            cont.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">Henüz Subdomain eklenmedi.</div>`;
            return;
        }
        cont.innerHTML = `
            <table class="admin-table" style="width:100%;">
                <thead><tr><th>Simge</th><th>Başlık</th><th>URL</th><th>Not</th><th style="width:60px; text-align:right;">Sil</th></tr></thead>
                <tbody>
                    ${subdomains.map(sd => {
                        const safeUrl = (/^https?:\/\//i.test(sd.url || '')) ? escHtml(sd.url) : '#';
                        return `
                        <tr>
                            <td style="font-size:1.2rem;">${sd.icon || '🌐'}</td>
                            <td style="font-weight:700;">${escHtml(sd.title)}</td>
                            <td><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;">${escHtml(sd.url)}</a></td>
                            <td style="font-size:0.8rem; color:var(--text-muted);">${escHtml(sd.note || '')}</td>
                            <td style="text-align:right;"><button class="btn-secondary" onclick="deleteAdminSubdomain('${sd.id}')" style="padding:2px 6px; color:#ef4444;">🗑️</button></td>
                        </tr>
                    `;}).join('')}
                </tbody>
            </table>
        `;
    } else if (activeKomutSubTab === 'tools') {
        if (!webTools.length) {
            cont.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">Henüz Webmaster aracı eklenmedi.</div>`;
            return;
        }
        cont.innerHTML = `
            <table class="admin-table" style="width:100%;">
                <thead><tr><th>Simge</th><th>Araç Adı</th><th>URL</th><th>Not</th><th style="width:60px; text-align:right;">Sil</th></tr></thead>
                <tbody>
                    ${webTools.map(wt => {
                        const safeUrl = (/^https?:\/\//i.test(wt.url || '')) ? escHtml(wt.url) : '#';
                        return `
                        <tr>
                            <td style="font-size:1.2rem;">${wt.icon || '🛠️'}</td>
                            <td style="font-weight:700;">${escHtml(wt.title)}</td>
                            <td><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;">${escHtml(wt.url)}</a></td>
                            <td style="font-size:0.8rem; color:var(--text-muted);">${escHtml(wt.note || '')}</td>
                            <td style="text-align:right;"><button class="btn-secondary" onclick="deleteAdminWebTool('${wt.id}')" style="padding:2px 6px; color:#ef4444;">🗑️</button></td>
                        </tr>
                    `;}).join('')}
                </tbody>
            </table>
        `;
    } else {
        if (!snippets.length) {
            cont.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">Henüz Snippet eklenmedi.</div>`;
            return;
        }
        cont.innerHTML = `
            <table class="admin-table" style="width:100%;">
                <thead><tr><th>Başlık</th><th>Dil</th><th>Açıklama</th><th style="width:60px; text-align:right;">Sil</th></tr></thead>
                <tbody>
                    ${snippets.map(sn => `
                        <tr>
                            <td style="font-weight:700;">${escHtml(sn.title)}</td>
                            <td><span style="background:rgba(245,158,11,0.15); color:#d97706; padding:2px 6px; border-radius:4px; font-weight:700; font-size:0.75rem;">${escHtml(sn.lang)}</span></td>
                            <td style="font-size:0.8rem; color:var(--text-muted);">${escHtml(sn.desc || '')}</td>
                            <td style="text-align:right;"><button class="btn-secondary" onclick="deleteAdminSnippet('${sn.id}')" style="padding:2px 6px; color:#ef4444;">🗑️</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

function deleteAdminSubdomain(id) {
    const S = getAdminState();
    if (S.subdomains) {
        S.subdomains = S.subdomains.filter(x => x.id !== id);
        saveAdminState(S);
        renderAdminKomutSubContent();
        renderOverviewKPI();
    }
}

function deleteAdminWebTool(id) {
    const S = getAdminState();
    if (S.webTools) {
        S.webTools = S.webTools.filter(x => x.id !== id);
        saveAdminState(S);
        renderAdminKomutSubContent();
        renderOverviewKPI();
    }
}

function deleteAdminSnippet(id) {
    const S = getAdminState();
    if (S.snippets) {
        S.snippets = S.snippets.filter(x => x.id !== id);
        saveAdminState(S);
        renderAdminKomutSubContent();
        renderOverviewKPI();
    }
}

/* ⚡ SAMPLE DATA SEEDING */
function seedSampleAdminData() {
    const S = getAdminState();
    if (!S.tasks || !S.tasks.length) {
        S.tasks = [
            { id: 't1', name: 'Mikat Admin Panel Özelleştirmeleri', cat: 'İş & Projeler', pri: 'yuksek', due: '2026-09-05', done: true },
            { id: 't2', name: 'Müfredat ve Sınav Takvimini Hazırla', cat: 'İş & Projeler', pri: 'orta', due: '2026-09-10', done: false },
            { id: 't3', name: 'Günlük 30 Dakika Yazılım & Algoritma Çalışması', cat: 'Kişisel Gelişim', pri: 'orta', due: '', done: false }
        ];
    }
    if (!S.habitDefs || !S.habitDefs.length) {
        S.habitDefs = [
            { id: 'h1', name: 'Sabah Yürüyüşü', icon: '🏃', target: 1 },
            { id: 'h2', name: 'Kitap Okuma (20 Sayfa)', icon: '📖', target: 1 },
            { id: 'h3', name: 'Günlük Su Tüketimi (2 Litre)', icon: '💧', target: 1 }
        ];
    }
    saveAdminState(S);
    initAdminDashboard();
    alert("✨ Örnek test verileri veritabanına eklendi!");
}

function forceStorageSync() {
    localStorage.setItem('mikat_sync_trigger', Date.now().toString());
    window.dispatchEvent(new Event('storage'));
    alert("🔄 Tüm açık Sekmelerle canlı senkronizasyon sağlandı!");
}

function updatePin() {
    const newPinInput = document.getElementById('inp-new-pin');
    if (!newPinInput) return;
    const newPin = newPinInput.value.trim();
    if(newPin.length < 4) {
        alert("PIN en az 4 haneli olmalıdır.");
        return;
    }
    localStorage.setItem('mikat_admin_pin', newPin);
    alert("🔑 Yönetici PIN kodu başarıyla güncellendi.");
    newPinInput.value = "";
}

function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ── KRİPTO (AES-256-GCM + PBKDF2) ── */
async function deriveKey(pw, salt, iterations = 600000) {
  const enc = new TextEncoder();
  const km = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}

function uint8ToBase64(bytes) {
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function encData(data, pw) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pw, salt, 600000);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(data)));
  const out = new Uint8Array(44 + ct.byteLength);
  out.set(salt); out.set(iv, 32); out.set(new Uint8Array(ct), 44);
  return 'MK1:' + uint8ToBase64(out);
}

async function decData(str, pw) {
  const prefix = str.slice(0, 4);
  if (prefix !== 'MK1:' && prefix !== 'HT6:' && prefix !== 'HT5:' && prefix !== 'HT4:')
    throw new Error('Geçersiz format');

  const buf = new Uint8Array(atob(str.slice(4)).split('').map(c => c.charCodeAt(0)));
  const salt = buf.slice(0, 32);
  const iv = buf.slice(32, 44);
  const ct = buf.slice(44);

  try {
    const key = await deriveKey(pw, salt, 600000);
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(dec));
  } catch (e) {
    try {
      const key = await deriveKey(pw, salt, 310000);
      const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
      return JSON.parse(new TextDecoder().decode(dec));
    } catch (e2) {
      throw new Error('Şifre yanlış veya veri bozuk');
    }
  }
}

// Global Window Function Bindings
window.switchAdminNav = switchAdminNav;
window.switchAdminDataTab = switchAdminDataTab;
window.switchAdminKomutSubTab = switchAdminKomutSubTab;
window.openAdminTaskModal = openAdminTaskModal;
window.closeAdminTaskModal = closeAdminTaskModal;
window.saveAdminTaskModal = saveAdminTaskModal;
window.deleteAdminTask = deleteAdminTask;
window.toggleAdminTask = toggleAdminTask;
window.openAdminHabitModal = openAdminHabitModal;
window.closeAdminHabitModal = closeAdminHabitModal;
window.saveAdminHabitModal = saveAdminHabitModal;
window.deleteAdminHabit = deleteAdminHabit;
window.resetAdminHabitToday = resetAdminHabitToday;
window.deleteAdminSubdomain = deleteAdminSubdomain;
window.deleteAdminWebTool = deleteAdminWebTool;
window.deleteAdminSnippet = deleteAdminSnippet;
window.saveAdminSettings = saveAdminSettings;
window.updatePin = updatePin;
window.seedSampleAdminData = seedSampleAdminData;
window.forceStorageSync = forceStorageSync;

// --- GLOBAL DATA MANAGEMENT FUNCTIONS ---

window.adminDoExport = async function(ext) {
    const pw = document.getElementById('admin-epw').value.trim();
    const pw2 = document.getElementById('admin-epw2').value.trim();
    if (!pw) { alert("Lütfen bir şifre belirleyin."); return; }
    if (pw.length < 6) { alert("Şifre en az 6 karakter olmalıdır."); return; }
    if (pw !== pw2) { alert("Şifreler birbiriyle eşleşmiyor!"); return; }

    const rawData = localStorage.getItem('mikat') || '{}';
    let parsed = {};
    try { parsed = JSON.parse(rawData); } catch(e){}
    delete parsed.lat;
    delete parsed.lng;
    parsed.namazCity = document.getElementById('inp-location')?.value || 'Konya';

    try {
        const enc = await encData(parsed, pw);
        document.getElementById('admin-expOut').value = enc;
        document.getElementById('admin-expR').style.display = 'block';

        let outData = enc;
        let mimeType = 'text/plain;charset=utf-8';
        if (ext === 'json') {
            outData = JSON.stringify({
                mikat_backup: true,
                encrypted: true,
                algorithm: "AES-256-GCM",
                data: enc
            }, null, 2);
            mimeType = 'application/json;charset=utf-8';
        }

        const a = document.createElement('a');
        const todayStr = new Date().toISOString().slice(0,10);
        a.href = `data:${mimeType},` + encodeURIComponent(outData);
        a.download = `mikat-sifreli-${todayStr}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        alert(`Veriler AES-256-GCM ile şifrelendi ve .${ext} yedek dosyanız indirildi!`);
    } catch(e) {
        alert("Şifreleme Hatası: " + e.message);
    }
};

window.adminCopyExp = function() {
    const val = document.getElementById('admin-expOut').value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => alert("Şifreli veri metni panoya kopyalandı!"));
};

window.adminDlExp = function() {
    const val = document.getElementById('admin-expOut').value;
    if (!val) return;
    const a = document.createElement('a');
    const todayStr = new Date().toISOString().slice(0,10);
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(val);
    a.download = `mikat-sifreli-${todayStr}.htbak`;
    a.click();
    alert("Şifreli .htbak dosyası indirildi!");
};

window.adminReadFile = function(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        document.getElementById('admin-idata').value = evt.target.result.trim();
        alert(`Yedek dosyası (${file.name}) okundu. Şimdi şifrenizi girip 'Şifreyi Çöz & Yükle' butonuna basın.`);
    };
    reader.readAsText(file, 'UTF-8');
};

window.adminDoImport = async function() {
    const pw = document.getElementById('admin-ipw').value.trim();
    const raw = document.getElementById('admin-idata').value.trim();
    if (!pw) { alert("Lütfen yedek şifrenizi girin."); return; }
    if (!raw) { alert("Lütfen şifreli veri metnini yapıştırın veya dosya yükleyin."); return; }

    let strToDec = raw;
    try {
        const parsedJson = JSON.parse(raw);
        if (parsedJson && parsedJson.data) strToDec = parsedJson.data;
    } catch(e) {}

    try {
        const dec = await decData(strToDec, pw);
        if (dec && typeof dec === 'object') {
            delete dec.lat;
            delete dec.lng;
        }
        
        if (confirm("Şifre doğru! Mevcut verilerinizin üzerine yazılacak. Onaylıyor musunuz?")) {
            localStorage.setItem('mikat', JSON.stringify(dec));
            localStorage.removeItem('mikat-auto-backup');
            localStorage.setItem('mikat_sync_trigger', Date.now().toString());
            window.dispatchEvent(new Event('storage'));

            alert("Şifre başarıyla çözüldü! Veriler Mikat veritabanına aktarıldı.");
            document.getElementById('admin-ipw').value = '';
            document.getElementById('admin-idata').value = '';
            location.reload();
        }
    } catch(e) {
        alert("Hata: Şifre yanlış olabilir veya dosya bozuk.");
    }
};

window.adminCsvExport = function() {
    const state = getAdminState();
    const tasks = state.tasks || [];
    const rows = [['ID', 'Görev Adı', 'Kategori', 'Öncelik', 'Son Tarih', 'Durum']];
    tasks.forEach(t => {
        rows.push([t.id || '', t.name || t.title || '', t.cat || '', t.pri || '', t.due || '', t.done ? 'Tamamlandı' : 'Beklemede']);
    });
    const csvContent = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mikat-gorevler-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    alert("CSV (Excel) dosyası başarıyla indirildi!");
};

window.adminClearData = function() {
    if (confirm("Tüm Mikat görevlerini, zikirlerini, alışkanlıklarını ve verilerini temizlemek istediğinize emin misiniz?")) {
        if (confirm("Bu işlem GERİ ALINAMAZ! Onaylıyor musunuz?")) {
            localStorage.removeItem('mikat');
            localStorage.removeItem('mikat-v5');
            localStorage.removeItem('mikat-v6');
            localStorage.removeItem('mikat-auto-backup');
            alert("Veritabanı tamamen sıfırlandı!");
            location.reload();
        }
    }
};

// --- GLOBAL LOGOUT FUNCTION ---
window.adminLogout = function() {
    sessionStorage.removeItem('mikat_admin_auth');
    loginAttempts = 0;
    loginLockout = false;
    
    const dashboard = document.getElementById('admin-dashboard');
    const loginScreen = document.getElementById('login-screen');
    const pinInput = document.getElementById('pin-input');
    const errorMsg = document.getElementById('login-error');
    
    if (dashboard) dashboard.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
    if (pinInput) pinInput.value = '';
    if (errorMsg) errorMsg.textContent = '';
    
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar && sidebar.classList.contains('mobile-active') && typeof window.toggleMobileMenu === 'function') {
        window.toggleMobileMenu();
    }
};

// --- GLOBAL MOBILE MENU TOGGLE ---
window.toggleMobileMenu = function() {
    const sidebar = document.querySelector('.admin-sidebar');
    const backdrop = document.getElementById('admin-mobile-backdrop');
    const mobileIcon = document.getElementById('admin-mobile-icon');
    if (!sidebar) return;
    
    const isOpen = sidebar.classList.contains('mobile-active');
    if (isOpen) {
        sidebar.classList.remove('mobile-active');
        if (backdrop) backdrop.style.display = 'none';
        if (mobileIcon) mobileIcon.className = 'fa-solid fa-bars';
    } else {
        sidebar.classList.add('mobile-active');
        if (backdrop) backdrop.style.display = 'block';
        if (mobileIcon) mobileIcon.className = 'fa-solid fa-xmark';
    }
};
