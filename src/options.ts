// options.ts
// This file is used to define the options for the application.
// It can be used to set default values, types, and other configurations.
import { BrowserWindow } from 'electron';
import settings from 'electron-settings';

export namespace Option {
    // WindowState contains the state of a window, including its position, size and
    // whether it is maximized or fullscreen.
    export type WindowState = {
        x: number | undefined;
        y: number | undefined;
        width: number;
        height: number;
        isMaximized: boolean;
        isFullscreen: boolean;
    };
    // MonitorWindowState is a function that monitors the state of a window and saves it to settings.
    export function MonitorWindowState(name: string) {
        const defaultWidth = 1000
        const defaultHeight = 800

        let state: WindowState;

        // initialize the state, either from settings or with default values
        if (settings.has(`windowState.${name}`)) {
            state = settings.getSync(`windowState.${name}`) as unknown as WindowState;
        } else {
            state = {
                x: undefined,
                y: undefined,
                width: defaultWidth,
                height: defaultHeight,
                isMaximized: false,
                isFullscreen: false,
            };
        }

        // declare a function to save the window state
        function monitor(window: BrowserWindow) {
            function saveState() {
                if (!state.isFullscreen && !state.isMaximized) {
                    let bounds = window.getBounds();
                    state.x = bounds.x;
                    state.y = bounds.y;
                    state.width = bounds.width;
                    state.height = bounds.height;
                }
                state.isMaximized = window.isMaximized();
                state.isFullscreen = window.isFullScreen();
                settings.set(`windowState.${name}`, state);
            }

            // save state every time a window event occurs that might change the state
            window.on('close', saveState);
            window.on('maximize', saveState);
            window.on('unmaximize', saveState);
            window.on('enter-full-screen', saveState);
            window.on('leave-full-screen', saveState);
            window.on('move', saveState);
            window.on('resize', saveState);
        }
        return { state, monitor };
    }
}