import React from 'react';
import { useSlate } from 'slate-react';
import { Editor } from 'slate';
import ToggleButton from '@material-ui/lab/ToggleButton';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
    coloredToggleButton: {
        color: 'rgba(0, 0, 0, 0.87)'
    }
}));

const isMarkdownActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const toggleMarkdown = (editor, format) => {
    const isActive = isMarkdownActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

export function MarkdownButton({ format, className = '', IconComponent, iconProps = {}, onClick, grouped = true }) {

    const editor = useSlate();
    const classes = useStyle();

    return (
        <ToggleButton
            className={
                clsx([
                    grouped ? 'MuiToggleButtonGroup-grouped' : '',
                    className,
                    classes.coloredToggleButton
                ])
            }
            size='small'
            value={ format } selected={ isMarkdownActive(editor, format) } onClick={ () => {
            toggleMarkdown(editor, format);
            if (onClick) {
                onClick();
            }
        } }>
            <IconComponent { ...iconProps } />
        </ToggleButton>
    );
}