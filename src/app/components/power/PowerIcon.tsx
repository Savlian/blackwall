import React from 'react';
import * as css from '../../styles/CustomHtml.css';
import { JUMBO_EMOJI_REG } from '../../utils/regex';

type PowerIconProps = {
  iconSrc: string;
};
export function PowerIcon({ iconSrc }: PowerIconProps) {
  return (
    <span className={css.EmoticonBase}>
      <span className={css.Emoticon()}>
        {JUMBO_EMOJI_REG.test(iconSrc) ? (
          iconSrc
        ) : (
          <img className={css.EmoticonImg} src={iconSrc} alt="some" />
        )}
      </span>
    </span>
  );
}
