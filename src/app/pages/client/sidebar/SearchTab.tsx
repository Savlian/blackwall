import React from 'react';
import { Icon, Icons } from 'folds';
import { useAtom } from 'jotai';
import { SidebarAvatar, SidebarItem, SidebarItemTooltip } from '../../../components/sidebar';
import { Search } from '../../../features/search';
import { searchModalAtom } from '../../../state/searchModal';

export function SearchTab() {
  const [opened, setOpen] = useAtom(searchModalAtom);

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return (
    <>
      <SidebarItem active={opened}>
        <SidebarItemTooltip tooltip="Search">
          {(triggerRef) => (
            <SidebarAvatar as="button" ref={triggerRef} outlined onClick={open}>
              <Icon src={Icons.Search} filled={opened} />
            </SidebarAvatar>
          )}
        </SidebarItemTooltip>
      </SidebarItem>
      {opened && <Search requestClose={close} />}
    </>
  );
}
