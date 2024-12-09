const Products = () => {
    const features = [
        {
            name: 'Push to deploy.',
            description:
                'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
            // icon: CloudArrowUpIcon,
        },
        {
            name: 'SSL certificates.',
            description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
            // icon: LockClosedIcon,
        },
        {
            name: 'Database backups.',
            description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
            // icon: ServerIcon,
        },
    ]
  return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl w-full space-y-20">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                  <div className="lg:w-1/2 space-y-8">
                      <h2 className="text-4xl font-semibold tracking-tight text-primary sm:text-5xl text-center lg:text-left">
                          DevBots
                      </h2>
                      <dl className="space-y-8">
                          {features.map((feature) => (
                              <div key={feature.name} className="relative">
                                  <dt className="font-semibold text-primary underline">
                                      {feature.name}
                                  </dt>
                                  <dd className="mt-2">{feature.description}</dd>
                              </div>
                          ))}
                      </dl>
                  </div>
                  <div className="lg:w-1/2 items-center justify-center flex flex-col">
                      <img
                          alt="Product screenshot"
                          src="https://tailwindui.com/plus/img/component-images/dark-project-app-screenshot.png"
                          width={2432}
                          height={1442}
                          className="w-full max-w-lg rounded-xl shadow-xl ring-1 ring-gray-400/10"
                      />
                  </div>
              </div>

              <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12">
                  <div className="lg:w-1/2 items-center justify-center flex flex-col">
                      <img
                          alt="Product screenshot"
                          src="https://tailwindui.com/plus/img/component-images/dark-project-app-screenshot.png"
                          width={2432}
                          height={1442}
                          className="w-full max-w-lg rounded-xl shadow-xl ring-1 ring-gray-400/10"
                      />
                  </div>
                  <div className="lg:w-1/2 space-y-8">
                      <h2 className="text-4xl font-semibold tracking-tight text-primary sm:text-5xl text-center lg:text-left">
                          DevMap
                      </h2>
                      <dl className="space-y-8">
                          {features.map((feature) => (
                              <div key={feature.name} className="relative">
                                  <dt className="font-semibold text-primary underline">
                                      {feature.name}
                                  </dt>
                                  <dd className="mt-2">{feature.description}</dd>
                              </div>
                          ))}
                      </dl>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default Products