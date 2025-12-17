from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from fastapi import FastAPI
import socket

def setup_telemetry(app: FastAPI, engine):
    """Setup OpenTelemetry tracing with Jaeger backend"""
    
    endpoint = "http://localhost:4318/v1/traces"
    
    # Check if Jaeger is running
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(('localhost', 4318))
        sock.close()
        if result != 0:
            print("TELEMETRY WARNING: Could not connect to Jaeger at localhost:4318. Tracing disabled.")
            return
    except Exception as e:
        print(f"TELEMETRY WARNING: Error checking Jaeger connection: {e}")
        return

    print("TELEMETRY: Connecting to Jaeger at localhost:4318...")

    # Create resource with service name
    resource = Resource.create(attributes={
        "service.name": "madlen-ai-backend",
        "service.version": "1.0.0"
    })

    # Create and set tracer provider BEFORE adding processors
    provider = TracerProvider(resource=resource)
    trace.set_tracer_provider(provider)

    # Create OTLP exporter and span processor
    otlp_exporter = OTLPSpanExporter(endpoint=endpoint)
    span_processor = BatchSpanProcessor(otlp_exporter)
    
    # Add processor to provider
    provider.add_span_processor(span_processor)

    # Instrument FastAPI
    FastAPIInstrumentor.instrument_app(app)
    print("TELEMETRY: FastAPI instrumented")

    # Instrument SQLAlchemy
    if engine:
        SQLAlchemyInstrumentor().instrument(engine=engine)
        print("TELEMETRY: SQLAlchemy instrumented")

    print("TELEMETRY SUCCESS: Connected to Jaeger! Traces will be sent to http://localhost:16686")
