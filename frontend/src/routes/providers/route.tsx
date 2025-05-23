import { createFileRoute, Outlet } from '@tanstack/react-router'

import {
  AppHeader,
  AppHeaderPart,
  AppHeaderTitle,
  AppSidebarSeparator,
  AppSidebarTrigger,
} from '@/components/app/app-header'

import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/providers')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  return (
    <>
      <AppHeader>
        <AppHeaderPart>
          <AppSidebarTrigger />
          <AppSidebarSeparator />
          <AppHeaderTitle>{t('routes.providers.route.Providers')}</AppHeaderTitle>
        </AppHeaderPart>
      </AppHeader>
      <Outlet />
    </>
  )
}
