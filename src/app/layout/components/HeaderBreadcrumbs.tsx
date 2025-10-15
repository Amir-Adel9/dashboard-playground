import { Link, useRouterState } from '@tanstack/react-router'
import clsx from 'clsx'
import { Home } from 'lucide-react'
import { Fragment } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'

const Breadcrumbs = () => {
  const routerState = useRouterState()

  const currentPath = routerState.location.pathname
    .split('/')
    .slice(1)
    .filter((segment) => Boolean(segment) && isNaN(Number(segment)))

  const pathWithHome = ['home', ...currentPath]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathWithHome.map((path, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              {index === 0 ? (
                <BreadcrumbLink asChild>
                  <Link to="/" className="capitalize">
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" /> {path}
                    </span>
                  </Link>
                </BreadcrumbLink>
              ) : index < pathWithHome.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link
                    to={`/${pathWithHome.slice(1, index + 1).join('/')}` as any}
                    className={clsx(
                      'capitalize',
                      (path === 'news' ||
                        path === 'media-library' ||
                        path === 'lessons' ||
                        path === 'enrollments') &&
                        'pointer-events-none',
                    )}
                  >
                    {path}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-secondary font-semibold cursor-default capitalize">
                  {path}
                </span>
              )}
            </BreadcrumbItem>
            {index < pathWithHome.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadcrumbs
