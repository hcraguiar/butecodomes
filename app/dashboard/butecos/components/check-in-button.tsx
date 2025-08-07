'use client'

import { useTransition, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/app/ui/button'
import { LoaderCircle, Star, UserRoundCheck, UserRoundX } from 'lucide-react'

type Props = {
  butecoId: string;
  participants?: string[];
  checkInId?: string;
  status: boolean;
  reviewForm: () => void;
  closePopUp: () => void;
  onCheckInChange?: (checkedIn: boolean, newCheckInId?: string) => void;
  onOpenCheckInModal?: () => void;
  }

export default function CheckInButton({ 
  butecoId, 
  participants = [], 
  checkInId, 
  status, 
  reviewForm, 
  closePopUp, 
  onCheckInChange,
  onOpenCheckInModal,
}: Props) {
  const [pending, startTransition] = useTransition()
  const [realCheckInId, setRealCheckInId] = useState(checkInId);
  const [optimisticCheckedIn, setOptimisticCheckedIn] = useState(realCheckInId ? true : false)
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(status)

  useEffect(() => {
    setRealCheckInId(checkInId)
    setOptimisticCheckedIn(!!checkInId)
    setHasEvaluated(status)
  }, [checkInId, status])
 
  // const handleCheckIn = async () => {
  //   const promise = fetch('/api/checkin', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ butecoId, participants }),
  //   })
    
  //   const res = await promise;
    
  //   if (!res.ok) {
  //     throw new Error('Erro ao fazer check-in.');
  //   }
    
  //   setOptimisticCheckedIn(true);
  //   const data = await res.json();
  //   return data.id as string;
  // }

  const handleUndo = async () => {
    if (!realCheckInId || hasEvaluated) return
    
    const res = await fetch(`/api/checkin`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkInId: realCheckInId }),
    })

    if (!res.ok) {
      throw new Error('Erro ao desfazer check-in.');
    }
    
    setOptimisticCheckedIn(false);
    setRealCheckInId(undefined);
    onCheckInChange?.(false, undefined)
  }

  // const onClick = () => {
  //   startTransition(() => {
  //     if (realCheckInId) {
  //       toast.promise(handleUndo(), {
  //         loading: 'Desfazendo check-in...',
  //         success: 'Check-in desfeito!',
  //         error: (err) => {
  //           return err.message || 'Erro ao desfazer check-in';
  //         },
  //       })
  //     } else {
  //       toast.promise(
  //         handleCheckIn().then(realId => {
  //           setRealCheckInId(realId);
  //           onCheckInChange?.(true, realId);
  //         }),
  //         {
  //           loading: 'Fazendo check-in...',
  //           success: 'Check-in realizado!',
  //           error: (err) => {
  //             setRealCheckInId(undefined);
  //             onCheckInChange?.(false, undefined);
  //             return err.message || 'Erro ao fazer check-in';
  //           },
  //         },
  //       )
  //     }
  //   })
  // }

  const onUndoClick = () => {
    startTransition(() => {
      const confirmUndo = confirm("Desfazer check-in?")
      if (!confirmUndo) return

      toast.promise(handleUndo(), {
        loading: 'Desfazendo check-in...',
        success: 'Check-in desfeito!',
        error: (err) => err.message || 'Erro ao desfazer check-in',
      });
    });
  }

  return (
  <>
    {/* Desktop */}
    <div className='hidden md:flex gap-2'>
      {!hasEvaluated && !optimisticCheckedIn && (
        <Button
          variant='outline'
          size='icon'
          onClick={() => {
            closePopUp();
            onOpenCheckInModal?.(); // abre modal de seleção
          }}
          disabled={pending}
          title="Fazer check-in"
        >
          <UserRoundCheck className='h-5 w-5' />
        </Button>
      )}

      {!hasEvaluated && optimisticCheckedIn && (
        <Button
          variant='outline'
          size='icon'
          onClick={onUndoClick}
          disabled={pending}
          title="Desfazer check-in"
        >
          {pending ? (
            <LoaderCircle className='animate-spin h-5 w-5' />
          ) : (
            <UserRoundX className='h-5 w-5' />
          )}
        </Button>
      )}

      {optimisticCheckedIn && (
        <Button
          variant='outline'
          size='icon'
          onClick={() => reviewForm()}
          title={hasEvaluated ? 'Ver avaliação' : 'Avaliar'}
        >
          <Star className='h-5 w-5' />
        </Button>
      )}
    </div>

    {/* Mobile */}
    <div className="md:hidden">
      {!hasEvaluated && !optimisticCheckedIn && (
        <button
          className="w-full px-4 py-2 text-sm flex items-center"
          onClick={() => {
            closePopUp();
            onOpenCheckInModal?.();
          }}
          disabled={pending}
        >
          <UserRoundCheck className='h-5 w-5 mr-2' />
          Fazer check-in
        </button>
      )}

      {!hasEvaluated && optimisticCheckedIn && (
        <button
          className="w-full px-4 py-2 text-sm flex items-center"
          onClick={onUndoClick}
          disabled={pending}
        >
          {pending ? (
            <LoaderCircle className='animate-spin h-5 w-5 mr-2' />
          ) : (
            <UserRoundX className='h-5 w-5 mr-2' />
          )}
          Desfazer check-in
        </button>
      )}

      {optimisticCheckedIn && (
        <button
          className="w-full px-4 py-2 text-sm flex items-center"
          onClick={() => {
            reviewForm();
            closePopUp();
          }}
        >
          <Star className='h-5 w-5 mr-2' />
          {hasEvaluated ? 'Ver avaliação' : 'Avaliar'}
        </button>
      )}
    </div>
  </>
  );


  // return (
  //   <>
  //   {/* Desktop */}
  //   <div className='hidden md:flex gap-2'>
  //   {!hasEvaluated && (
  //     <Button
  //       variant='outline'
  //       size='icon'
  //       onClick={onClick}
  //       disabled={pending}
  //       title={
  //         pending ? 'Aguarde'
  //         : optimisticCheckedIn ? 'Desfazer check-in'
  //         : 'Fazer check-in'
  //       }
  //       >
  //       {pending ? 
  //         <LoaderCircle className='animate-spin h-5 w-5' />  
  //         : optimisticCheckedIn ? 
  //         <UserRoundX className='h-5 w-5' /> 
  //         :<UserRoundCheck className='h-5 w-5' /> 
  //       }
  //     </Button>
  //   )}

  //   {optimisticCheckedIn && (
  //     <Button
  //       variant='outline'
  //       size='icon'
  //       onClick={() => reviewForm()}
  //       title={!hasEvaluated ? 'Avaliar' : 'Mudar avaliação'}
  //     >
  //       <Star className='h-5 w-5'/>
  //     </Button>
  //   )}
  //   </div>
  //   {/* Mobile */}
  //   <div className="md:hidden">
  //     {!hasEvaluated && (
  //       <button 
  //       className="w-full px-4 py-2 text-sm flex items-center"
  //       onClick={() => {
  //         onClick();
  //       }}
  //       disabled={pending}
  //     >
  //       {pending ? 
  //         <LoaderCircle className='animate-spin h-5 w-5 mr-2' />  
  //         : optimisticCheckedIn ? 
  //         <UserRoundX className='h-5 w-5 mr-2' /> 
  //         :<UserRoundCheck className='h-5 w-5 mr-2' /> 
  //       }
  //       {
  //         pending ? 'Aguarde'
  //         : optimisticCheckedIn ? 'Desfazer check-in'
  //         : 'Fazer check-in'
  //       }
  //     </button>                 
  //     )}

  //     {optimisticCheckedIn && (
  //       <button 
  //         className="w-full px-4 py-2 text-sm flex items-center"
  //         onClick={() => {
  //           reviewForm();
  //           closePopUp();
  //         }}
  //       >
  //         <Star className='h-5 w-5 mr-2'/>
  //         {!hasEvaluated ? 'Avaliar' : 'Mudar avaliação'}
  //       </button>
  //     )}
  //   </div>
  //   </>
  // )
}
