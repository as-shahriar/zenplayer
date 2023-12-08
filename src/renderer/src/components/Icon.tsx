type IconProps = {
    iconSpritePath: string;
    name: string;
    className?: string;
    style?: object;
    fill?: string;
    width?: number;
    height?: number;
    ariaHidden?: boolean;
    title?: string;
    desc?: string;
};

export const Icon = (props: IconProps) => {
    const {
        iconSpritePath,
        name,
        style = {},
        fill = '#333',
        width = 15,
        className = '',
        height = 15,
        ariaHidden = true,
        title,
        desc
    } = props;

    return (
        <svg
            width={width}
            style={style}
            fill={fill}
            height={height}
            aria-hidden={ariaHidden}
            className={className + ' icon-' + name}
        >
            {title && <title>{title}</title>}
            {desc && <desc>{desc}</desc>}
            <use xlinkHref={iconSpritePath + '#' + name} />
        </svg>
    );
};
