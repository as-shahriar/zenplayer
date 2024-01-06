import { Icon } from './Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';
import { Fragment, useEffect, useRef } from 'react';
import './Topbar.scss';
import { debounce } from 'lodash';

type TopbarProps = {
    title: string;
    goBack: () => void;
    isHome: boolean;
    onSearch: (value: string) => void;
};

export const Topbar = (props: TopbarProps) => {
    const { title, goBack, isHome, onSearch } = props;

    const debouncedSearch = useRef(
        debounce(async (search) => {
            onSearch(search);
        }, 300)
    ).current;

    const onSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    return (
        <div className="page-topbar-container">
            {
                <div className="d-flex justify-content-end align-items-center">
                    {!isHome && (
                        <Fragment>
                            <button className="btn btn-back p-0 px-2 py-1 me-1" onClick={goBack}>
                                <Icon
                                    className="mt-n1"
                                    iconSpritePath={iconDef}
                                    name="left-arrow"
                                    width={10}
                                    height={10}
                                />
                            </button>
                            <div className="flex-grow-1">
                                <div className="d-grid me-3">
                                    <div className="text-truncate">{title}</div>
                                </div>
                            </div>
                        </Fragment>
                    )}
                    <div className="custom-input-container">
                        <input
                            className="form-control rounded custom-input"
                            placeholder="Search"
                            onChange={onSearchChange}
                        />
                        <Icon
                            className="search"
                            iconSpritePath={iconDef}
                            name="search"
                            width={10}
                            height={10}
                        />
                    </div>
                </div>
            }
        </div>
    );
};
