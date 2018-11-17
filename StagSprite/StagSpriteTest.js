import StagSprite from './StagSprite.js'

test('StagSprite', () => {
    const sprite = new StagSprite({ x: 0, y: 0 })
    expect(sprite).toBeDefined();
});

test('StagSprite baseline', () => {
    const sprite = new StagSprite({ x: 0, y: 0 })
    sprite.width = 128;
    sprite.height = 64;
    expect(sprite.baseline[0][0].x).toBe(-64);
    expect(sprite.baseline[0][0].y).toBe(-32);
    expect(sprite.baseline[0][1].x).toBe(0);
    expect(sprite.baseline[0][1].y).toBe(0);
    expect(sprite.baseline[1][0].x).toBe(0);
    expect(sprite.baseline[1][0].y).toBe(0);
    expect(sprite.baseline[1][1].x).toBe(64);
    expect(sprite.baseline[1][1].y).toBe(-32);
});

test('StagSprite height', () => {
    const sprite = new StagSprite({ x: 0, y: 0, h:1 })
    expect(sprite.baseline[0][0].y).toBe(0);
    expect(sprite.baseline[0][1].y).toBe(32);
    expect(sprite.baseline[1][0].y).toBe(32);
    expect(sprite.baseline[1][1].y).toBe(0);
});