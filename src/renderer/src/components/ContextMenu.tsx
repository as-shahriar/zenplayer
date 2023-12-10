import { Menu, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { ReactElement, ReactNode, useCallback, useId } from 'react';
import './ContextMenu.scss';

type ContextMenuProps = {
    children: ReactElement;
    menuItems: ReactNode;
};
export const ContextMenu = (props: ContextMenuProps) => {
    const MENU_ID = useId();
    const { show } = useContextMenu({
        id: MENU_ID
    });

    const handleContextMenu = useCallback((event) => {
        show({
            event
        });
    }, []);

    return (
        <div className="context-menu-container">
            <span onContextMenu={handleContextMenu}>{props.children}</span>
            <Menu id={MENU_ID}>{props.menuItems}</Menu>
        </div>
    );
};
