import StagEntityMock from './StagEntityMock.js'
import 'pixi-spine';

/* Does not work cuz AJAX in jest
test('StagEntity', done => {
    PIXI.loader.add({ name: "player", url: "../public/spine/player.json" }).load(() => {
        const entity = new StagEntity({ texture: "player", i: 0, j: 0 })
        expect(entity).toBeDefined();
        done();
    });
});
*/

test('StagEntityMock', () => {
    const entity = new StagEntityMock({ i: 0, j: 0 })
    expect(entity).toBeDefined();
});

test('StagEntity j=10', () => {
    const entity = new StagEntityMock({ i: 0, j: 10 })
    expect(entity.j).toBe(10);
});

test('StagEntity baseline', () => {
    const entity = new StagEntityMock({ x: 0, y: 0 })
    expect(entity.baseline[0][0].x).toBe(-64);
    expect(entity.baseline[0][1].x).toBe(64);
    expect(entity.baseline[0][0].y).toBe(0);
    expect(entity.baseline[0][1].y).toBe(0);
});