import StagContainer from './StagContainer.js'
import { StagEntityMock, StagSprite, StagTile } from '../index.js';

test('StagContainer', () => {
    const container = new StagContainer();
    expect(container).toBeDefined();
});

test('Destroy children', () => {
    const container = new StagContainer();
    const sprite = new StagSprite({ x: 0, y: 10 })
    const sprite2 = new StagSprite({ x: 0, y: 0 })
    container.addChild(sprite);
    container.addChild(sprite2);
    container.destroyChildren();
    expect(container.children.length).toBe(0);
});

test('Ordering between 2 points', () => {
    const container = new StagContainer();
    const point = new PIXI.Container();
    point.y = 10;
    const point2 = new PIXI.Container();
    point2.y = 0;
    container.addChild(point);
    container.addChild(point2);
    expect(container.getChildIndex(point2)).toBe(0);
});

test('Ordering between point and sprite but no intersection', () => {
    const container = new StagContainer();
    const sprite = new StagSprite({ x: 1500, y: 0 })
    const point = new PIXI.Container();
    point.x = 10;
    point.y = 500;
    container.addChild(point);
    container.addChild(sprite);
    expect(container.getChildIndex(point)).toBe(0);
});

test('Ordering between point and sprite', () => {
    const container = new StagContainer();
    const sprite = new StagSprite({ x: 0, y: 0 })
    const point = new PIXI.Container();
    point.x = 63;
    point.y = 1;
    container.addChild(point);
    container.addChild(sprite);
    expect(container.getChildIndex(point)).toBe(1);
});

test('Ordering between point and sprite 2', () => {
    const container = new StagContainer();
    const sprite = new StagSprite({ x: 572, y: 316 })
    const point = new PIXI.Container();
    point.x = 541;
    point.y = 234;
    container.addChild(sprite);
    container.addChild(point);
    expect(container.getChildIndex(point)).toBe(0);
});

test('Ordering between sprites', () => {
    const container = new StagContainer();
    const sprite = new StagSprite({ x: 0, y: 10 })
    const sprite2 = new StagSprite({ x: 0, y: 0 })
    container.addChild(sprite);
    container.addChild(sprite2);
    expect(container.getChildIndex(sprite2)).toBe(0);
});

test('Ordering between sprites and baseline entity', () => {
    const container = new StagContainer();
    const sprite = new StagSprite({ x: 0, y: 0 })
    const entity = new StagEntityMock({ x: 65, y: 2 })
    container.addChild(sprite);
    container.addChild(entity);
    expect(container.getChildIndex(entity)).toBe(1);
});


test('Ordering between sprite and bottom baseline entity', () => {
    const container = new StagContainer();
    const sprite = new StagSprite({ x: 572, y: 316 })
    const entity = new StagEntityMock({ x: 610, y: 355 })
    container.addChild(sprite);
    container.addChild(entity);
    expect(container.getChildIndex(entity)).toBe(1);
});

test('Ordering between sprite and Tile height', () => {
    const container = new StagContainer();
    const sprite = new StagTile({ i: 11, j: 8, h:2 })
    const entity = new StagEntityMock({ x: 1408, y: 256 })
    container.addChild(sprite);
    container.addChild(entity);
    expect(container.getChildIndex(entity)).toBe(0);
});

test('Bug array.sort : Ordering between entity and multiple tiles', () => {
    const container = new StagContainer();
    const tile = new StagTile({ i: 3, j: 15, h:2 })
    const tile2 = new StagTile({ i: 5, j: 15, h:2 })
    const tile3 = new StagTile({ i: 8, j: 15, h:2 })
    const entity = new StagEntityMock({ i: 4, j: 18 })
    container.addChild(tile);
    container.addChild(tile2);
    container.addChild(tile3);
    container.addChild(entity);
    entity.x = 562.7480250000029;
    entity.y = 485.87971249999805;
    container.sortChildren();
    expect(container.getChildIndex(entity)).toBe(0);
});

test('Bug 2 : Baseline got 2 intersection (one bottom and one top)', () => {
    const container = new StagContainer();
    const tile = new StagTile({ i: 5, j: 15, h:2 })
    const entity = new StagEntityMock({ x: 822, y: 533 })
    container.addChild(tile);
    container.addChild(entity);
    container.sortChildren();
    expect(container.getChildIndex(entity)).toBe(1);
});

test('Bug 3 : Baseline intersection on x &  y axis too', () => {
    const container = new StagContainer();
    const tile = new StagTile({ i: 9, j: 16, h:2 })
    const entity = new StagEntityMock({ x: 1140.8054500000094, y: 554.9335374999939 })
    container.addChild(tile);
    container.addChild(entity);
    container.sortChildren();
    expect(container.getChildIndex(entity)).toBe(1);
});

test('Bug 4 : (height) sprites above other sprites', () => {
    const container = new StagContainer();
    const sprite = new StagSprite({ x: 1759.7, y: 306.45 , h:2.34375})
    const sprite2 = new StagSprite({ x: 1784.7, y: 350.45 })
    const sprite3 = new StagSprite({ x: 1727.7, y: 381.45 })
    container.addChild(sprite);
    container.addChild(sprite2);
    container.addChild(sprite3);
    container.sortChildren();
    expect(container.getChildIndex(sprite)).toBe(0);
    expect(container.getChildIndex(sprite3)).toBe(1);
    expect(container.getChildIndex(sprite2)).toBe(2);
});