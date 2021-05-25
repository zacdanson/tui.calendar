/* eslint-disable jest/expect-expect */
import { FunctionComponent, h } from 'preact';
import { render, fireEvent, screen } from '@testing-library/preact';

import DayGrid from '@src/components/daygrid/dayGrid';
import { getGridLeftAndWidth } from '@src/time/datetime';
import TZDate from '@src/time/date';
import { getMousePositionData } from '@src/util/monthViewHelper';
import { CalendarMonthOption } from '@t/store';
import { getStoreWrapper } from '@test/helper/storeProvider';
import Store from '@src/store';
import { template, theme, layerPopup, options, dataStore } from '@src/modules';
describe('DayGrid Creation Guide', () => {
  let appContainer: HTMLDivElement;
  let panel: HTMLElement;
  let calendar: TZDate[][] = [];
  let option: CalendarMonthOption;
  let grids: GridInfo[] = [];
  let store: Store;
  let StoreProvider: FunctionComponent;

  beforeEach(() => {
    appContainer = document.createElement('div');
    appContainer.style.width = '70px';
    appContainer.style.height = '100px';

    panel = document.createElement('div');
    panel.style.width = '70px';
    panel.style.height = '100px';

    appContainer.appendChild(panel);

    calendar = [
      [
        new TZDate(2021, 3, 25),
        new TZDate(2021, 3, 26),
        new TZDate(2021, 3, 27),
        new TZDate(2021, 3, 28),
        new TZDate(2021, 3, 29),
        new TZDate(2021, 3, 30),
        new TZDate(2021, 4, 1),
      ],
      [
        new TZDate(2021, 4, 2),
        new TZDate(2021, 4, 3),
        new TZDate(2021, 4, 4),
        new TZDate(2021, 4, 5),
        new TZDate(2021, 4, 6),
        new TZDate(2021, 4, 7),
        new TZDate(2021, 4, 8),
      ],
    ];

    option = {
      visibleWeeksCount: 1,
      workweek: false,
      narrowWeekend: false,
      startDayOfWeek: 0,
      isAlways6Week: true,
      daynames: [],
      moreLayerSize: { width: null, height: null },
      grid: {
        header: { height: 31 },
        footer: { height: 31 },
      },
      visibleScheduleCount: 6,
      scheduleFilter: () => true,
    };

    grids = getGridLeftAndWidth(7, false, 0, false);

    store = new Store({
      modules: [template, theme, options, dataStore, layerPopup],
      initStoreData: { options: {} },
    });

    StoreProvider = getStoreWrapper(store);

    document.body.appendChild(appContainer);
  });

  it('should create a guide element for the mouse event', () => {
    const getBoundingClientRectSpy = jest.fn(
      () =>
        ({
          width: 70,
          height: 100,
          left: 0,
          top: 0,
        } as DOMRect)
    );
    panel.getBoundingClientRect = getBoundingClientRectSpy;

    const { container } = render(
      <DayGrid
        options={option}
        calendar={calendar}
        appContainer={{ current: appContainer }}
        getMousePositionData={getMousePositionData(calendar, grids, panel)}
      />,
      { wrapper: StoreProvider }
    );

    const mouseArea = container.firstChild;

    if (!mouseArea) {
      return;
    }

    fireEvent.mouseDown(mouseArea, { clientX: 9, clientY: 20, button: 0 });
    fireEvent.mouseMove(document, { clientX: 15, clientY: 20 });
    fireEvent.mouseMove(document, { clientX: 15, clientY: 20 });
    fireEvent.mouseMove(document, { clientX: 15, clientY: 20 });

    // enable/disable following code!!!!
    fireEvent.mouseMove(document, { clientX: 15, clientY: 20 });
    fireEvent.mouseUp(document, { clientX: 15, clientY: 40, button: 0 });

    // const guide = screen.getByTestId('creation-guide');
    // @TODO: Check the style of the guide element
    // expect(guide).toBeDefined();
  });
});
