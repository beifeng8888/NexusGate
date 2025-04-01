import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ArrowUpDownIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import { newApiError } from '@/lib/error'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Upstream } from './columns'

export function RowActionButton({ data }: { data: Upstream }) {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await api.admin.upstream({ id }).delete()
      if (error) throw newApiError(error)
      return data
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['upstreams'] })
      const prevItems = (queryClient.getQueryData(['upstreams']) || []) as Upstream[]
      queryClient.setQueryData(
        ['upstreams'],
        prevItems.filter((item) => item.id !== id),
      )
      return { prevItems }
    },
    onError: (error, _, context) => {
      toast.error(error.message)
      if (context) queryClient.setQueryData(['upstreams'], context.prevItems)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['upstreams'] })
    },
    onSuccess: (data) => {
      toast.success(`Provider ${data.name} deleted.`)
    },
  })

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">{t('Open menu')}</span>
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => navigate({ to: '/requests', search: { upstreamId: data.id } })}>
            <ArrowUpDownIcon />
            {t('View requests')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <Trash2Icon />
              {t('Delete')}
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
          <AlertDialogDescription>
            <Trans
              i18nKey="This provider <bold>{{name}}</bold> will be deleted."
              values={{ name: data.name }}
              components={{ bold: <span className="text-foreground font-bold" /> }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => mutate(data.id)}>
            {t('Continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
