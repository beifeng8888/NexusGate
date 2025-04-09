import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useLocalStorage } from 'usehooks-ts'

import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'

export function AuthDialog() {
  const [secret, setSecret] = useLocalStorage('admin-secret', '')
  const { t } = useTranslation()

  const { data: checkPassed = true } = useQuery({
    queryKey: ['check-secret', secret],
    queryFn: async () => {
      const { data, error } = await api.admin.index.get()
      if (error) {
        toast.error(t('Src_components_app_auth-dialog_InvalidSecret'))
        return false
      }
      return data
    },
    enabled: !!secret,
  })

  const showDialog = !checkPassed || !secret

  return (
    <Dialog open={showDialog}>
      <DialogContent withClose={false}>
        <DialogHeader>
          <DialogTitle>{t('Src_components_app_auth-dialog_AuthenticationRequired')}</DialogTitle>
          <DialogDescription>{t('Src_components_app_auth-dialog_AdminSecret')}</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            setSecret((e.currentTarget.querySelector('input') as HTMLInputElement).value)
          }}
        >
          <Input type="password" />
          <DialogFooter>
            <Button type="submit">{t('Src_components_app_auth-dialog_Save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
