import { BookCheck, PencilRuler, Terminal, Bot, SquarePlus, ChartArea } from 'lucide-react';

const Products = () => {
    const DevBots = [
        {
            name: 'Customized Chatbots.',
            description:
                'Easily create customized chatbot with just filling forms.',
            icon: Bot,
        },
        {
            name: 'Easy Integration.',
            description: 'Get Free API keys and integrate with your website in minutes.',
            icon: SquarePlus,
        },
        {
            name: 'Analytics Dashboard.',
            description: 'Get detailed analytics of your chatbot queries, timestamps, IPs and much more.',
            icon: ChartArea,
        },
    ]
    const UniversalBox = [
        {
            name: 'Prebuilt Templates.',
            description:
                'Explore our extensive library of 50+ project templates designed for various applications.',
            icon: BookCheck,
        },
        {
            name: 'One click setup.',
            description: 'npm package helps users to install the package and Scaffolding in one click.',
            icon: PencilRuler,
        },
        {
            name: 'More optional commands.',
            description: 'Explore more optional commands to clone, customize and deploy your projects.',
            icon: Terminal,
        },
    ]
  return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl w-full space-y-20">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                  <div className="lg:w-1/2 space-y-8">
                      <h2 className="text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                          DevBots
                      </h2>
                      <dl className="space-y-8">
                          {DevBots.map((feature) => (
                              <div key={feature.name} className="relative">
                                  <div className='flex-row flex items-center gap-2'>
                                      {feature.icon && <feature.icon className="h-5 w-5 text-primary" />}
                                      <dt className="font-semibold text-primary underline">
                                          {feature.name}
                                      </dt>
                                  </div>
                                  <dd className="mt-2">{feature.description}</dd>
                              </div>
                          ))}
                      </dl>
                  </div>
                  <div className="lg:w-1/2 items-center justify-center flex flex-col">
                      <img
                          alt="Product screenshot"
                          src="https://i.ibb.co/fpc1dCL/Screenshot-2024-12-19-081803.png"
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
                          src="https://i.ibb.co/wRjgvtJ/Screenshot-2024-12-12-104932.png"
                          width={2432}
                          height={1442}
                          className="w-full max-w-lg rounded-xl shadow-xl ring-1 ring-gray-400/10"
                      />
                  </div>
                  <div className="lg:w-1/2 space-y-8">
                      <h2 className="text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                          Universal-Box
                      </h2>
                      <dl className="space-y-8">
                          {UniversalBox.map((feature) => (
                              <div key={feature.name} className="relative">
                                <div className='flex-row flex items-center gap-2'>
                                      {feature.icon && <feature.icon className="h-5 w-5 text-primary" />}
                                      <dt className="font-semibold text-primary underline">
                                          {feature.name}
                                      </dt>
                                </div>
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