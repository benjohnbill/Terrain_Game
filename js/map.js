// ============================================================================
// map.js - 헥스 맵 및 셀 클래스 정의
// 세계정복 턴제 전략 게임 - Data Layer
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// HexCell 클래스
// ─────────────────────────────────────────────────────────────────────────────
window.HexCell = class HexCell {
  constructor(q, r) {
    this.q = q;
    this.r = r;
    this.owner = null;
    this.building = null;
    this.population = 20;
    this.terrain = 'plains';
    this.provinceId = null;
    this.provinceName = null;
    this.archetype = null;
    this.primaryFunction = null;
    this.economyValue = 10;
    this.localGarrison = 8;
    this.defenseValue = 10;
    this.informationConfidence = 0.45;
    this.strategicTags = [];
  }

  key() {
    return `${this.q},${this.r}`;
  }

  applyProvince(province) {
    if (!province) return;
    this.provinceId = province.id;
    this.provinceName = province.name;
    this.archetype = province.archetype;
    this.terrain = province.primaryTerrain;
    this.primaryFunction = province.primaryFunction;
    this.population = Math.round(20 * province.populationWeight);
    this.economyValue = Math.round(10 * province.economyWeight);
    this.localGarrison = Math.round(8 * province.garrisonWeight);
    this.defenseValue = Math.round(10 * province.defenseWeight);
    this.strategicTags = Array.from(province.strategicTags);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HexMap 클래스
// ─────────────────────────────────────────────────────────────────────────────
window.HexMap = class HexMap {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hexSize = 38;
    this.hexes = new Map();       // Map<string, HexCell>  key = "q,r"
    this.gridCols = 0;
    this.gridRows = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    // 인터랙션 상태
    this.selectedHex = null;          // 선택된 헥스 키
    this.highlightedHexes = new Map(); // Map<hexKey, color>
    this.hoveredHex = null;           // 현재 호버 중인 헥스 키
    this._clickCallback = null;
    this._hoverCallback = null;

    // 애니메이션
    this._animFrame = 0;
    this._pulsePhase = 0;

    // 캔버스 크기 맞추기
    this.resize();
    this._bindEvents();
  }

  // ──────────────────────────────────────────────
  // 이벤트 바인딩
  // ──────────────────────────────────────────────
  _bindEvents() {
    // 클릭 이벤트
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const coords = this.pixelToHex(x, y);
      const hex = this.getHex(coords.q, coords.r);
      if (hex && this._clickCallback) {
        this._clickCallback(hex);
      }
    });

    // 호버 이벤트
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const coords = this.pixelToHex(x, y);
      const hex = this.getHex(coords.q, coords.r);
      const key = hex ? hex.key() : null;

      if (key !== this.hoveredHex) {
        this.hoveredHex = key;
        if (this._hoverCallback) {
          this._hoverCallback(hex, e.clientX, e.clientY);
        }
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredHex = null;
      if (this._hoverCallback) {
        this._hoverCallback(null, 0, 0);
      }
    });

    // 리사이즈 감지
    window.addEventListener('resize', () => this.resize());

    if (typeof ResizeObserver !== 'undefined' && this.canvas.parentElement) {
      const ro = new ResizeObserver(() => this.resize());
      ro.observe(this.canvas.parentElement);
    }
  }

  // ──────────────────────────────────────────────
  // 캔버스 리사이즈
  // ──────────────────────────────────────────────
  resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
    } else {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
    this._recalcOffset();
  }

  _recalcOffset() {
    // 맵 전체 바운딩 박스 계산
    const sqrt3 = Math.sqrt(3);
    const w = sqrt3 * this.hexSize;
    const h = 2 * this.hexSize;

    let minPx = Infinity, maxPx = -Infinity;
    let minPy = Infinity, maxPy = -Infinity;

    this.hexes.forEach((hex) => {
      const px = this.hexSize * (sqrt3 * hex.q + sqrt3 / 2 * hex.r);
      const py = this.hexSize * (1.5 * hex.r);
      minPx = Math.min(minPx, px - w / 2);
      maxPx = Math.max(maxPx, px + w / 2);
      minPy = Math.min(minPy, py - h / 2);
      maxPy = Math.max(maxPy, py + h / 2);
    });

    if (!isFinite(minPx)) {
      this.offsetX = this.canvas.width / 2;
      this.offsetY = this.canvas.height / 2;
      return;
    }

    const mapW = maxPx - minPx;
    const mapH = maxPy - minPy;
    const centerX = (minPx + maxPx) / 2;
    const centerY = (minPy + maxPy) / 2;

    this.offsetX = this.canvas.width / 2 - centerX;
    this.offsetY = this.canvas.height / 2 - centerY;
  }

  // ──────────────────────────────────────────────
  // 맵 생성
  // ──────────────────────────────────────────────
  generate(factionCount, options = {}) {
    this.hexes.clear();

    // 팩션 수에 따른 그리드 크기 결정
    if (options.phase1Active) {
      this.gridCols = 30;
      this.gridRows = 30;
      this.hexSize = 18;
    } else if (factionCount <= 4) {
      this.gridCols = 8;
      this.gridRows = 8;
      this.hexSize = 38;
    } else if (factionCount === 5) {
      this.gridCols = 9;
      this.gridRows = 9;
      this.hexSize = 38;
    } else {
      this.gridCols = 10;
      this.gridRows = 10;
      this.hexSize = 38;
    }

    // 오프셋 좌표 → 축 좌표 변환하여 헥스 생성 (pointy-top, odd-r offset)
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const q = col - Math.floor(row / 2);
        const r = row;
        const cell = new window.HexCell(q, r);
        this.hexes.set(cell.key(), cell);
      }
    }

    if (options.phase1Active) {
      this._assignPhase1ProvinceData();
    }

    // 시작 위치를 맵 가장자리/코너에 배치
    const startPositions = this._getStartPositions(factionCount);

    for (let fId = 0; fId < factionCount; fId++) {
      const positions = startPositions[fId];
      positions.forEach(pos => {
        const hex = this.getHex(pos.q, pos.r);
        if (hex) {
          hex.owner = fId;
          hex.population = 30;
        }
      });
    }

    this._recalcOffset();
  }

  _assignPhase1ProvinceData() {
    const provinces = window.PROVINCES || [];
    if (provinces.length === 0) return;

    this.hexes.forEach((hex) => {
      const row = hex.r;
      const col = hex.q + Math.floor(row / 2);
      const provinceIndex = Math.abs(Math.floor(row / 5) * 5 + Math.floor(col / 6)) % provinces.length;
      hex.applyProvince(provinces[provinceIndex]);
      hex.informationConfidence = hex.owner === 0 ? 0.85 : 0.45;
    });
  }

  _getStartPositions(factionCount) {
    // 맵 가장자리의 다양한 위치에서 시작 영토 2~3개 배정
    const allHexes = Array.from(this.hexes.values());
    const rows = this.gridRows;
    const cols = this.gridCols;

    // 코너 / 가장자리 앵커 포인트 (offset 좌표 기준)
    const anchors = [
      { col: 1, row: 1 },                          // 좌상
      { col: cols - 2, row: 1 },                    // 우상
      { col: 1, row: rows - 2 },                    // 좌하
      { col: cols - 2, row: rows - 2 },             // 우하
      { col: Math.floor(cols / 2), row: 0 },        // 상단 중앙
      { col: Math.floor(cols / 2), row: rows - 1 }, // 하단 중앙
    ];

    const results = [];

    for (let fId = 0; fId < factionCount; fId++) {
      const anchor = anchors[fId % anchors.length];
      const aq = anchor.col - Math.floor(anchor.row / 2);
      const ar = anchor.row;

      // 앵커 헥스 + 인접 2개를 시작 영토로
      const positions = [{ q: aq, r: ar }];
      const neighbors = this._getRawNeighbors(aq, ar);
      let added = 0;
      for (const n of neighbors) {
        if (this.getHex(n.q, n.r) && added < 2) {
          positions.push(n);
          added++;
        }
      }
      results.push(positions);
    }

    return results;
  }

  _getRawNeighbors(q, r) {
    // Pointy-top 축 좌표 6방향
    return [
      { q: q + 1, r: r },
      { q: q - 1, r: r },
      { q: q, r: r + 1 },
      { q: q, r: r - 1 },
      { q: q + 1, r: r - 1 },
      { q: q - 1, r: r + 1 }
    ];
  }

  // ──────────────────────────────────────────────
  // 헥스 조회
  // ──────────────────────────────────────────────
  getHex(q, r) {
    return this.hexes.get(`${q},${r}`) || null;
  }

  getHexByKey(key) {
    return this.hexes.get(key) || null;
  }

  getAllHexes() {
    return this.hexes;
  }

  getTotalHexCount() {
    return this.hexes.size;
  }

  // ──────────────────────────────────────────────
  // 이웃 헥스 조회
  // ──────────────────────────────────────────────
  getNeighbors(q, r) {
    const directions = this._getRawNeighbors(q, r);
    const result = [];
    for (const d of directions) {
      const hex = this.getHex(d.q, d.r);
      if (hex) result.push(hex);
    }
    return result;
  }

  // 팩션의 영토에 인접한 적/중립 헥스
  getAdjacentEnemyHexes(factionId) {
    const enemyHexes = new Map();
    this.hexes.forEach((hex) => {
      if (hex.owner !== factionId) return;
      const neighbors = this.getNeighbors(hex.q, hex.r);
      for (const n of neighbors) {
        if (n.owner !== factionId) {
          enemyHexes.set(n.key(), n);
        }
      }
    });
    return Array.from(enemyHexes.values());
  }

  // 팩션의 영토 중 적과 맞닿은 헥스
  getAdjacentOwnHexes(factionId) {
    const borderHexes = new Map();
    this.hexes.forEach((hex) => {
      if (hex.owner !== factionId) return;
      const neighbors = this.getNeighbors(hex.q, hex.r);
      for (const n of neighbors) {
        if (n.owner !== factionId) {
          borderHexes.set(hex.key(), hex);
          break;
        }
      }
    });
    return Array.from(borderHexes.values());
  }

  // ──────────────────────────────────────────────
  // 좌표 변환 (Pointy-top 축 좌표)
  // ──────────────────────────────────────────────
  hexToPixel(q, r) {
    const sqrt3 = Math.sqrt(3);
    const x = this.hexSize * (sqrt3 * q + sqrt3 / 2 * r) + this.offsetX;
    const y = this.hexSize * (1.5 * r) + this.offsetY;
    return { x, y };
  }

  pixelToHex(px, py) {
    const sqrt3 = Math.sqrt(3);
    const x = px - this.offsetX;
    const y = py - this.offsetY;

    // 역변환
    const q = (x * sqrt3 / 3 - y / 3) / this.hexSize;
    const r = (y * 2 / 3) / this.hexSize;

    // Cube 좌표로 반올림
    return this._axialRound(q, r);
  }

  _axialRound(q, r) {
    const s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const dq = Math.abs(rq - q);
    const dr = Math.abs(rr - r);
    const ds = Math.abs(rs - s);

    if (dq > dr && dq > ds) {
      rq = -rr - rs;
    } else if (dr > ds) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  }

  // ──────────────────────────────────────────────
  // 콜백 등록
  // ──────────────────────────────────────────────
  onClick(callback) {
    this._clickCallback = callback;
  }

  onHover(callback) {
    this._hoverCallback = callback;
  }

  // ──────────────────────────────────────────────
  // 하이라이트 / 선택
  // ──────────────────────────────────────────────
  setHighlightedHexes(hexKeys, color) {
    this.highlightedHexes.clear();
    for (const key of hexKeys) {
      this.highlightedHexes.set(key, color || '#ffffff');
    }
  }

  clearHighlights() {
    this.highlightedHexes.clear();
  }

  setSelectedHex(hexKey) {
    this.selectedHex = hexKey;
  }

  // ──────────────────────────────────────────────
  // 렌더링
  // ──────────────────────────────────────────────
  render(game) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 애니메이션 위상 업데이트
    this._pulsePhase = (Date.now() % 2000) / 2000;

    // 캔버스 클리어
    ctx.clearRect(0, 0, w, h);

    // 모든 헥스 렌더링
    this.hexes.forEach((hex) => {
      this._renderHex(ctx, hex, game);
    });
  }

  _renderHex(ctx, hex, game) {
    const { x, y } = this.hexToPixel(hex.q, hex.r);
    const key = hex.key();
    const isSelected = this.selectedHex === key;
    const isHighlighted = this.highlightedHexes.has(key);
    const isHovered = this.hoveredHex === key;
    const highlightColor = this.highlightedHexes.get(key);

    ctx.save();

    // 헥스 경로 생성
    const path = this._hexPath(x, y);

    // ── 그림자 효과 ──
    if (isSelected || isHovered) {
      ctx.shadowColor = isSelected ? '#00d2ff' : 'rgba(255,255,255,0.3)';
      ctx.shadowBlur = isSelected ? 20 : 10;
    }

    // ── 채우기 ──
    if (hex.owner !== null && game && game.factions && game.factions[hex.owner]) {
      const faction = game.factions[hex.owner];
      // 그라디언트 채우기
      const grad = ctx.createRadialGradient(x, y, 0, x, y, this.hexSize);
      grad.addColorStop(0, faction.colorLight + 'cc');
      grad.addColorStop(1, faction.color + '99');
      ctx.fillStyle = grad;
    } else {
      // 중립 헥스: 어두운 회색 그라디언트
      const grad = ctx.createRadialGradient(x, y, 0, x, y, this.hexSize);
      grad.addColorStop(0, '#3a3a4a');
      grad.addColorStop(1, '#252530');
      ctx.fillStyle = grad;
    }

    ctx.fill(path);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // ── 테두리 ──
    if (isHighlighted) {
      // 공격 가능 헥스: 펄스 테두리
      const pulse = 0.5 + 0.5 * Math.sin(this._pulsePhase * Math.PI * 2);
      ctx.strokeStyle = highlightColor;
      ctx.lineWidth = 2 + pulse * 2;
      ctx.globalAlpha = 0.6 + pulse * 0.4;
      ctx.stroke(path);
      ctx.globalAlpha = 1;
    } else if (isSelected) {
      // 선택된 헥스: 밝은 글로우 테두리
      ctx.strokeStyle = '#00d2ff';
      ctx.lineWidth = 3;
      ctx.stroke(path);
      // 이중 테두리 글로우
      ctx.strokeStyle = 'rgba(0,210,255,0.3)';
      ctx.lineWidth = 6;
      ctx.stroke(path);
    } else if (hex.owner !== null && game && game.factions && game.factions[hex.owner]) {
      // 소유 헥스: 팩션 색상 테두리
      ctx.strokeStyle = game.factions[hex.owner].color;
      ctx.lineWidth = 1.5;
      ctx.stroke(path);
    } else {
      // 중립 헥스: 얇은 테두리
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke(path);
    }

    // ── 호버 오버레이 ──
    if (isHovered) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fill(path);
    }

    // ── 건물 아이콘 ──
    if (hex.building) {
      const building = window.BUILDINGS[hex.building];
      if (building) {
        ctx.font = `${this.hexSize * 0.55}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(building.icon, x, y);
      }
    }

    ctx.restore();
  }

  _hexPath(cx, cy) {
    const path = new Path2D();
    for (let i = 0; i < 6; i++) {
      // Pointy-top: 첫 꼭짓점이 30도부터 시작
      const angle = (Math.PI / 180) * (60 * i - 30);
      const vx = cx + this.hexSize * Math.cos(angle);
      const vy = cy + this.hexSize * Math.sin(angle);
      if (i === 0) {
        path.moveTo(vx, vy);
      } else {
        path.lineTo(vx, vy);
      }
    }
    path.closePath();
    return path;
  }
};
